import { Definition } from '../interfaces';
import { capitalizeFirst } from '../utils';

export function generateModule(definition: Definition): string {
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
