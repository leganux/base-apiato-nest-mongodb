import { Injectable } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bill } from './schemas/bill.schema';
import { Model } from 'mongoose';
import { ApiatoService } from 'src/core/apiato/apiato.service';

@Injectable()
export class BillService extends ApiatoService<
  Bill,
  CreateBillDto,
  UpdateBillDto
> {
  constructor(@InjectModel(Bill.name) private billModel: Model<Bill>) {
    super(billModel, {});
  }
}
