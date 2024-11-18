import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { Tax, TaxSchema } from './schemas/tax.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tax.name, schema: TaxSchema }])
  ],
  controllers: [TaxController],
  providers: [TaxService],
  exports: [TaxService],
})
export class TaxModule {}
