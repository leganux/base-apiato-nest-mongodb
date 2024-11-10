import { Definition } from '../interfaces';
import { capitalizeFirst } from '../utils';

export function generateService(definition: Definition): string {
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
