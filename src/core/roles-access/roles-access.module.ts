import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesAccess, RolesAccessSchema } from './schemas/roles-access.schema';
import { RolesAccessService } from './roles-access.service';
import { RolesAccessController } from './roles-access.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RolesAccess.name, schema: RolesAccessSchema },
    ]),
  ],
  controllers: [RolesAccessController],
  providers: [RolesAccessService],
  exports: [RolesAccessService],
})
export class RolesAccessModule { }
