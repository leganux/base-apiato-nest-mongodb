import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  Query as QueryParams,
  Put,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { IResponse } from './apiato.service';

const defaultExample = { foo: 'bar' };

export class ApiatoController<TCreateDto, TUpdateDto, TService> {
  constructor(private readonly service: TService) {}

  @Post('/')
  @ApiQuery({
    name: 'populate',
    required: false,
    type: String,
    isArray: false,
    description: 'Use populate[fieldName]=true for dynamic population',
  })
  @ApiQuery({
    name: 'select',
    required: false,
    type: String,
    example: 'field1,field2,... fieldN',
  })
  @ApiBody({
    type: Object,
    examples: {
      example1: {
        summary: 'Insert an element',
        description: 'A complete example of a user.',
        value: defaultExample,
      },
    },
  })
  async createOne(
    @Body() createDto: TCreateDto,
    @Res() res: Response,
    @QueryParams() query: any,
  ) {
    const resp: IResponse = await (this.service as any).createOne(
      createDto,
      query,
    );
    return res.status(resp.status).json(resp);
  }

  @Post('/many')
  @ApiQuery({
    name: 'populate',
    required: false,
    type: String,
    isArray: false,
    description: 'Use populate[fieldName]=true for dynamic population',
  })
  @ApiQuery({
    name: 'select',
    required: false,
    type: String,
    example: 'field1,field2,... fieldN',
  })
  @ApiBody({
    type: Object,
    examples: {
      example1: {
        summary: 'Insert an element',
        description: 'A complete example of a user.',
        value: defaultExample,
      },
    },
  })
  async createMany(
    @Body() createDto: TCreateDto[],
    @Res() res: Response,
    @QueryParams() query: any,
  ) {
    const resp: IResponse = await (this.service as any).createMany(
      createDto,
      query,
    );
    return res.status(resp.status).json(resp);
  }

  @Get('/')
  @ApiQuery({
    name: 'populate',
    required: false,
    type: String,
    isArray: false,
    description: 'Use populate[fieldName]=true for dynamic population',
  })
  @ApiQuery({
    name: 'select',
    required: false,
    type: String,
    example: 'field1,field2,... fieldN',
  })
  async getMany(@QueryParams() query: any, @Res() res: Response) {
    const resp: IResponse = await (this.service as any).getMany(query);
    return res.status(resp.status).json(resp);
  }

  @Get('/where')
  async getOneWhere(@Res() res: Response, @QueryParams() query: any) {
    const resp: IResponse = await (this.service as any).getOneWhere(query);
    return res.status(resp.status).json(resp);
  }

  @Get('/:id')
  async getOneById(
    @Param('id') id: string,
    @Res() res: Response,
    @QueryParams() query: any,
  ) {
    const resp: IResponse = await (this.service as any).getOneById(id, query);
    return res.status(resp.status).json(resp);
  }

  @Put('/updateOrCreate')
  async findUpdateOrCreate(
    @Body() update: TUpdateDto,
    @Res() res: Response,
    @QueryParams() query: any,
  ) {
    const resp: IResponse = await (this.service as any).findUpdateOrCreate(
      update,
      query,
    );
    return res.status(resp.status).json(resp);
  }

  @Put('/findAndUpdate')
  async findUpdate(
    @Body() update: TUpdateDto,
    @Res() res: Response,
    @QueryParams() query: any,
  ) {
    const resp = await (this.service as any).findUpdate(update, query);
    return res.status(resp.status).json(resp);
  }

  @Put('/:id')
  async updateById(
    @Body() update: TUpdateDto,
    @Res() res: Response,
    @Param('id') id: string,
    @QueryParams() query: any,
  ) {
    const resp = await (this.service as any).findUpdate(update, id, query);
    return res.status(resp.status).json(resp);
  }

  @Delete('/:id')
  async findIdAndDelete(
    @Param('id') id: string,
    @Res() res: Response,
    @QueryParams() query: any,
  ) {
    const resp = await (this.service as any).findIdAndDelete(id, query);
    return res.status(resp.status).json(resp);
  }

  @Post('/datatable')
  async Datatable(
    @Res() res: Response,
    @Body() body: any,
    @QueryParams() query: any,
  ) {
    const resp = await (this.service as any).Datatable(
      body,
      body.pipeline,
      query.search_fields,
    );
    return res.status(resp.status).json(resp);
  }
}
