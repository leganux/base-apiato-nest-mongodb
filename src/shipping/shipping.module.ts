import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { Shipping, ShippingSchema } from './schemas/shipping.schema';
import {
  UserAddress,
  UserAddressSchema,
} from '../user/schemas/user-address.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shipping.name, schema: ShippingSchema },
      { name: UserAddress.name, schema: UserAddressSchema },
    ]),
    ConfigModule,
  ],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}
