import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { promisify } from 'util';

interface Field {
    name: string;
    type: string;
    mandatory: boolean;
    default?: any;
    values?: string[];
    relation?: string;
}

interface Definition {
    version: number;
    name: string;
    description: string;
    fields: Field[];
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

function capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSchema(definition: Definition): string {
    const className = capitalizeFirst(definition.name);
    let imports = `import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';\nimport { Document, Schema as MongooseSchema } from 'mongoose';\n\n`;
    let schemaContent = `export type ${className}Document = ${className} & Document;\n\n`;
    schemaContent += `@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })\n`;
    schemaContent += `export class ${className} {\n`;

    for (const field of definition.fields) {
        const propDecorator = ['@Prop('];
        const decoratorOptions = [];

        if (field.mandatory) {
            decoratorOptions.push('required: true');
        }

        if (field.type === 'enum' && field.values) {
            decoratorOptions.push(`enum: [${field.values.map(v => `'${v}'`).join(', ')}]`);
            // Add enum type definition
            imports += `export enum ${className}${capitalizeFirst(field.name)}Enum {\n`;
            field.values.forEach(value => {
                imports += `  ${value.toUpperCase()} = '${value}',\n`;
            });
            imports += `}\n\n`;
        }

        if (field.default !== undefined) {
            decoratorOptions.push(`default: ${JSON.stringify(field.default)}`);
        }

        if (field.type === 'relationship' && field.relation) {
            const [relatedModel] = field.relation.split('.');
            decoratorOptions.push(`type: MongooseSchema.Types.ObjectId`);
            decoratorOptions.push(`ref: '${capitalizeFirst(relatedModel)}'`);
        }

        if (decoratorOptions.length > 0) {
            propDecorator.push(`{ ${decoratorOptions.join(', ')} }`);
        }
        propDecorator.push(')');

        schemaContent += `  ${propDecorator.join('')}\n`;
        
        if (field.type === 'relationship' && field.relation) {
            schemaContent += `  ${field.name}: MongooseSchema.Types.ObjectId;\n\n`;
        } else if (field.type === 'enum' && field.values) {
            schemaContent += `  ${field.name}: ${className}${capitalizeFirst(field.name)}Enum;\n\n`;
        } else {
            const typeMap: { [key: string]: string } = {
                'string': 'string',
                'number': 'number',
                'boolean': 'boolean',
                'date': 'Date'
            };
            schemaContent += `  ${field.name}: ${typeMap[field.type] || 'string'};\n\n`;
        }
    }

    schemaContent += `  @Prop({ type: MongooseSchema.Types.Date, default: null })\n`;
    schemaContent += `  deletedAt: Date;\n`;
    schemaContent += `}\n\n`;
    schemaContent += `export const ${className}Schema = SchemaFactory.createForClass(${className});`;

    return imports + schemaContent;
}

function generateCreateDto(definition: Definition): string {
    const className = capitalizeFirst(definition.name);
    let imports = `import { IsNotEmpty, IsOptional, IsString, IsEnum, IsNumber, IsBoolean, IsDate } from 'class-validator';\n`;

    if (definition.fields.some(f => f.type === 'relationship')) {
        imports += `import { IsMongoId } from 'class-validator';\n`;
    }

    // Import enums from schema
    const hasEnums = definition.fields.some(f => f.type === 'enum');
    if (hasEnums) {
        imports += `import { ${definition.fields
            .filter(f => f.type === 'enum')
            .map(f => `${className}${capitalizeFirst(f.name)}Enum`)
            .join(', ')} } from '../schemas/${definition.name}.schema';\n`;
    }

    imports += '\n';

    let dtoContent = `export class Create${className}Dto {\n`;

    for (const field of definition.fields) {
        const decorators = [];
        if (field.mandatory) {
            decorators.push('@IsNotEmpty()');
        } else {
            decorators.push('@IsOptional()');
        }

        switch (field.type) {
            case 'string':
                decorators.push('@IsString()');
                break;
            case 'number':
                decorators.push('@IsNumber()');
                break;
            case 'boolean':
                decorators.push('@IsBoolean()');
                break;
            case 'date':
                decorators.push('@IsDate()');
                break;
            case 'enum':
                if (field.values) {
                    decorators.push(`@IsEnum(${className}${capitalizeFirst(field.name)}Enum)`);
                }
                break;
            case 'relationship':
                decorators.push('@IsMongoId()');
                break;
        }

        decorators.forEach(decorator => {
            dtoContent += `  ${decorator}\n`;
        });

        if (field.type === 'enum') {
            dtoContent += `  ${field.name}: ${className}${capitalizeFirst(field.name)}Enum;\n\n`;
        } else if (field.type === 'relationship') {
            dtoContent += `  ${field.name}: string;\n\n`;
        } else {
            dtoContent += `  ${field.name}: ${field.type};\n\n`;
        }
    }

    dtoContent += `}`;
    return imports + dtoContent;
}

function generateUpdateDto(definition: Definition): string {
    const className = capitalizeFirst(definition.name);
    return `import { PartialType } from '@nestjs/mapped-types';\nimport { Create${className}Dto } from './create-${definition.name}.dto';\n\nexport class Update${className}Dto extends PartialType(Create${className}Dto) {}\n`;
}

function generateController(definition: Definition): string {
    const className = capitalizeFirst(definition.name);
    return `import { Controller } from '@nestjs/common';
import { Create${className}Dto } from './dto/create-${definition.name}.dto';
import { Update${className}Dto } from './dto/update-${definition.name}.dto';
import { ${className}Service } from './${definition.name}.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('${className}')
@Controller('/api/v1/${definition.name}')
export class ${className}Controller extends ApiatoController<
  Create${className}Dto,
  Update${className}Dto,
  ${className}Service
> {
  constructor(private readonly ${definition.name}Service: ${className}Service) {
    super(${definition.name}Service);
  }
}\n`;
}

function generateService(definition: Definition): string {
    const className = capitalizeFirst(definition.name);
    return `import { Injectable } from '@nestjs/common';
import { Create${className}Dto } from './dto/create-${definition.name}.dto';
import { Update${className}Dto } from './dto/update-${definition.name}.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ${className} } from './schemas/${definition.name}.schema';
import { Model } from 'mongoose';
import { ApiatoService } from 'src/core/apiato/apiato.service';

@Injectable()
export class ${className}Service extends ApiatoService<
  ${className},
  Create${className}Dto,
  Update${className}Dto
> {
  constructor(@InjectModel(${className}.name) private ${definition.name}Model: Model<${className}>) {
    super(${definition.name}Model, {});
  }
}\n`;
}

function generateModule(definition: Definition): string {
    const className = capitalizeFirst(definition.name);
    return `import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ${className}Controller } from './${definition.name}.controller';
import { ${className}Service } from './${definition.name}.service';
import { ${className}, ${className}Schema } from './schemas/${definition.name}.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ${className}.name, schema: ${className}Schema }])
  ],
  controllers: [${className}Controller],
  providers: [${className}Service],
  exports: [${className}Service],
})
export class ${className}Module {}\n`;
}

function updateRolesAndAccess(definition: Definition, configPath: string): void {
    // Read the existing config file content
    const configContent = fs.readFileSync(configPath, 'utf-8');
    
    // Find the position where rolesAndAccessConfig object ends
    const configEndMatch = configContent.match(/export const rolesAndAccessConfig[^{]*{([\s\S]*?)};/);
    if (!configEndMatch) {
        throw new Error('Could not find rolesAndAccessConfig in the file');
    }

    // Create the new module entry
    const moduleEntry = `  ${definition.name}: {
    routes: [
      { path: '/', method: 'POST', roles: rolesMap.ADMIN },
      { path: '/many', method: 'POST', roles: rolesMap.ADMIN },
      { path: '/', method: 'GET', roles: rolesMap.ADMIN },
      { path: '/where', method: 'GET', roles: rolesMap.REGISTERED },
      { path: '/:id', method: 'GET', roles: rolesMap.REGISTERED },
      { path: '/:id', method: 'PUT', roles: rolesMap.REGISTERED },
      { path: '/updateOrCreate', method: 'PUT', roles: rolesMap.REGISTERED },
      { path: '/findAndUpdate', method: 'PUT', roles: rolesMap.REGISTERED },
      { path: '/:id', method: 'DELETE', roles: rolesMap.ADMIN },
      { path: '/datatable', method: 'POST', roles: rolesMap.ADMIN },
      { path: '/schema', method: 'GET', roles: rolesMap.PUBLIC },
    ],
  }`;

    // Get the existing config content
    const existingConfig = configEndMatch[1];

    // Check if the module already exists in the config
    const moduleRegex = new RegExp(`${definition.name}:\\s*{[\\s\\S]*?},?`);
    if (moduleRegex.test(existingConfig)) {
        // If module exists, replace it
        const updatedConfig = existingConfig.replace(moduleRegex, moduleEntry + ',');
        const updatedContent = configContent.replace(configEndMatch[0], `export const rolesAndAccessConfig = {${updatedConfig}};`);
        fs.writeFileSync(configPath, updatedContent);
    } else {
        // If module doesn't exist, add it
        const lastBracePos = configContent.lastIndexOf('}');
        const needsComma = existingConfig.trim().length > 0;
        const updatedContent = 
            configContent.slice(0, lastBracePos) + 
            (needsComma ? ',\n' : '\n') +
            moduleEntry + '\n' +
            configContent.slice(lastBracePos);
        fs.writeFileSync(configPath, updatedContent);
    }
}

async function confirmOverwrite(filePath: string): Promise<boolean> {
    if (fs.existsSync(filePath)) {
        const answer = await question(`File ${filePath} already exists. Do you want to overwrite it? (y/n): `);
        return answer.toLowerCase() === 'y';
    }
    return true;
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error('Please provide the path to the definition file');
        process.exit(1);
    }

    const definitionPath = args[0];
    const definition: Definition = JSON.parse(fs.readFileSync(definitionPath, 'utf-8'));
    const basePath = path.join('src', definition.name);

    // Create base directory
    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath, { recursive: true });
    }

    // Create subdirectories
    ['dto', 'schemas'].forEach(dir => {
        const dirPath = path.join(basePath, dir);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    });

    // Generate and write files
    const files = {
        [`schemas/${definition.name}.schema.ts`]: generateSchema(definition),
        [`dto/create-${definition.name}.dto.ts`]: generateCreateDto(definition),
        [`dto/update-${definition.name}.dto.ts`]: generateUpdateDto(definition),
        [`${definition.name}.controller.ts`]: generateController(definition),
        [`${definition.name}.service.ts`]: generateService(definition),
        [`${definition.name}.module.ts`]: generateModule(definition),
    };

    for (const [relativePath, content] of Object.entries(files)) {
        const filePath = path.join(basePath, relativePath);
        if (await confirmOverwrite(filePath)) {
            fs.writeFileSync(filePath, content);
            console.log(`Generated ${filePath}`);
        }
    }

    // Update roles and access config
    const rolesConfigPath = path.join('src', 'core', 'config', 'rolesAndAccess.config.ts');
    if (await confirmOverwrite(rolesConfigPath)) {
        updateRolesAndAccess(definition, rolesConfigPath);
        console.log(`Updated ${rolesConfigPath}`);
    }

    rl.close();
}

main().catch(console.error);
