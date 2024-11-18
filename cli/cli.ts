import * as fs from 'fs';
import * as path from 'path';
import { Definition } from './interfaces';
import { confirmOverwrite, rl } from './utils';
import { generateSchema } from './generators/schema.generator';
import {
  generateCreateDto,
  generateUpdateDto,
} from './generators/dto.generator';
import { generateController } from './generators/controller.generator';
import { generateService } from './generators/service.generator';
import { generateModule } from './generators/module.generator';

function updateAppModule(definition: Definition, appModulePath: string): void {
  let content = fs.readFileSync(appModulePath, 'utf-8');
  const className =
    definition.name.charAt(0).toUpperCase() + definition.name.slice(1);
  const moduleName = `${className}Module`;

  // Check if module is already imported
  if (!content.includes(`import { ${moduleName} }`)) {
    // Add import statement after the last import
    const lastImportIndex = content.lastIndexOf('import ');
    const endOfLastImport = content.indexOf('\n', lastImportIndex);
    const importStatement = `import { ${moduleName} } from './${definition.name}/${definition.name}.module';\n`;

    content =
      content.slice(0, endOfLastImport + 1) +
      importStatement +
      content.slice(endOfLastImport + 1);

    // Find the position to insert the new module
    const jwtModuleIndex = content.indexOf('JwtModule.registerAsync');
    const beforeJwtModule = content.lastIndexOf(',', jwtModuleIndex);

    // Insert new module before JwtModule
    content =
      content.slice(0, beforeJwtModule + 1) +
      `\n    ${moduleName},` +
      content.slice(beforeJwtModule + 1);

    fs.writeFileSync(appModulePath, content);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Please provide the path to the definition file');
    process.exit(1);
  }

  const definitionPath = args[0];
  const definition: Definition = JSON.parse(
    fs.readFileSync(definitionPath, 'utf-8'),
  );
  const basePath = path.join('src', definition.name);

  // Create base directory
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true });
  }

  // Create subdirectories
  ['dto', 'schemas'].forEach((dir) => {
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

  // Update app.module.ts
  const appModulePath = path.join('src', 'app.module.ts');
  if (await confirmOverwrite(appModulePath)) {
    updateAppModule(definition, appModulePath);
    console.log(`Updated ${appModulePath}`);
  }

  rl.close();
}

main().catch(console.error);
