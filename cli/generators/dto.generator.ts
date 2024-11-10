import { Definition } from '../interfaces';
import { capitalizeFirst } from '../utils';

export function generateCreateDto(definition: Definition): string {
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

export function generateUpdateDto(definition: Definition): string {
    const className = capitalizeFirst(definition.name);
    return `import { PartialType } from '@nestjs/mapped-types';\nimport { Create${className}Dto } from './create-${definition.name}.dto';\n\nexport class Update${className}Dto extends PartialType(Create${className}Dto) {}\n`;
}
