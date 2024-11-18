import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillController } from './bill.controller';
import { BillService } from './services/bill.service';
import { FacturamaService } from './services/facturama.service';
import { Bill, BillSchema } from './schemas/bill.schema';
import { BillConfig, BillConfigSchema } from './schemas/bill-config.schema';
import { UserAddress, UserAddressSchema } from '../user/schemas/user-address.schema';
import { AuthModule } from '../core/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bill.name, schema: BillSchema },
      { name: BillConfig.name, schema: BillConfigSchema },
      { name: UserAddress.name, schema: UserAddressSchema },
    ]),
    AuthModule,
  ],
  controllers: [BillController],
  providers: [BillService, FacturamaService],
  exports: [BillService, FacturamaService],
})
export class BillModule {}
