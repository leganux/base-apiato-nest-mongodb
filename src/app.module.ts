import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './core/auth/auth.module';
import { MailModule } from './core/mail/mail.module';
import { FileModule } from './core/file/file.module';
import { WelcomesModule } from './welcome/welcomes.module';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './user/schemas/user.schema';
import { AccessMiddleware } from './core/middleware/access.middleware';
import { rolesAndAccessConfig } from './core/config/rolesAndAccess.config';
import { PaymentModule } from './payment/payment.module';
import { ShippingModule } from './shipping/shipping.module';
import { BillModule } from './bill/bill.module';
import { CategoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';
import { Measurement_unitModule } from './measurement_unit/measurement_unit.module';
import { SupplierModule } from './supplier/supplier.module';
import { TaxModule } from './tax/tax.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';



interface RoleAccess {
  path: string;
  method: string;
  roles: string[];
}

interface ConfigItem {
  routes: RoleAccess[];
}

interface RolesAndAccessConfig {
  [key: string]: ConfigItem;
}

const getPaths = (config: RolesAndAccessConfig) => {
  console.info('Loading middleware... ');
  const paths = [];
  for (const [key, val] of Object.entries(config)) {
    console.info(key);
    console.table(val.routes);
    paths.push({ path: '/api/v1/' + key + '/*', method: RequestMethod.ALL });
  }
  return paths;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    MailModule,
    FileModule,
    WelcomesModule,
    PaymentModule,
    ShippingModule,
    BillModule,
    CategoryModule,
    DiscountModule,
    Measurement_unitModule,
    SupplierModule,
    TaxModule,
    BrandModule,
    ProductModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') ||
          '09283746gbdeujdbd37edgu3y78r3r3duheixh783tr783___$$L3GaNUx',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessMiddleware)
      .forRoutes(...getPaths(rolesAndAccessConfig));
  }
}
