import { Definition } from '../interfaces';
import { capitalizeFirst } from '../utils';

export function generateSchema(definition: Definition): string {
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
      decoratorOptions.push(
        `enum: [${field.values.map((v) => `'${v}'`).join(', ')}]`,
      );
      // Add enum type definition
      imports += `export enum ${className}${capitalizeFirst(field.name)}Enum {\n`;
      field.values.forEach((value) => {
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
    } else if (field.type === 'mixed') {
      decoratorOptions.push(`type: MongooseSchema.Types.Mixed`);
    }

    if (decoratorOptions.length > 0) {
      propDecorator.push(`{ ${decoratorOptions.join(', ')} }`);
    }
    propDecorator.push(')');

    schemaContent += `  ${propDecorator.join('')}\n`;

    if (field.type === 'relationship' && field.relation) {
      schemaContent += `  ${field.name}: MongooseSchema.Types.ObjectId;\n\n`;
    }
    else if (field.type === 'mixed') {
      schemaContent += `  ${field.name}?: any;\n\n`;
    }
    else if (field.type === 'enum' && field.values) {
      schemaContent += `  ${field.name}: ${className}${capitalizeFirst(field.name)}Enum;\n\n`;
    } else {
      const typeMap: { [key: string]: string } = {
        string: 'string',
        number: 'number',
        boolean: 'boolean',
        date: 'Date',
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
