import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schemas/payment.schema';
import { Model } from 'mongoose';
import {
  ApiatoService,
  IResponse,
  Responses,
} from 'src/core/apiato/apiato.service';
import { PayDto } from './dto/pay.dto.ts';
import { PaymentSourceEnum } from './interfaces/payment.interface';

@Injectable()
export class PaymentService extends ApiatoService<
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto
> {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<Payment>) {
    super(paymentModel, {});
  }

  async pay(payBody: PayDto, query: any): Promise<IResponse> {
    try {
      switch (payBody.source) {
        case PaymentSourceEnum.CASH:
          /*Aqui el codigo de pago en efectivo genera una imagen con la cantidad de pago */
          break;
        case PaymentSourceEnum.DIRECT_TRANSFER:
          /*Aqui el codigo de pago en transferencia direecta sube un archivo de pago  */
          break;
        case PaymentSourceEnum.OP_CARD:
          /*Aqui el codigo de pago en transferencia openpay tarjeta */
          break;
        case PaymentSourceEnum.OP_SPEI:
          /*Aqui el codigo de pago en transferencia Sepei */
          break;
        case PaymentSourceEnum.OP_STORE:
          /*Aqui el codigo de pago en transferencia tienda */
          break;
        case PaymentSourceEnum.MP_GENERAL:
          /*Aqui el codigo de pago en transferencia mercadopago */
          break;
      }

      return Responses.success({}, 'Ok');
    } catch (error) {
      console.error(error);
      return Responses.internalServerError(error.message);
    }
  }
}
