import {
  Body,
  Controller,
  Post,
  Query as QueryParams,
  Res,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentService } from './payment.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { IResponse } from '../core/apiato/apiato.service';
import { PayDto } from './dto/pay.dto.ts';

@ApiTags('Payment')
@Controller('/api/v1/payment')
export class PaymentController extends ApiatoController<
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentService
> {
  constructor(private readonly paymentService: PaymentService) {
    super(paymentService);
  }

  @Post('/pay')
  async pay(
    @Body() payDto: PayDto,
    @Res() res: Response,
    @QueryParams() query: any,
  ) {
    const resp: IResponse = await this.paymentService.pay(payDto, query);
    return res.status(resp.status).json(resp);
  }

  /*
   *. TODO:
   *  1. ListPaymentsByType
   *  2. WEBHOOK () guardar en  webhooks service tambien
   *  3.
   *
   * */
}
