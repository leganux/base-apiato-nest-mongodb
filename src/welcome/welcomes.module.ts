import { Module } from '@nestjs/common';
import { WelcomesService } from './welcomes.service';
import { WelcomesController } from './welcomes.controller';

@Module({
  controllers: [WelcomesController],
  providers: [WelcomesService],
})
export class WelcomesModule {}
