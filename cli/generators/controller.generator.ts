import { Definition } from '../interfaces';
import { capitalizeFirst } from '../utils';

export function generateController(definition: Definition): string {
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
