import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NetworkInterfaceInfo, networkInterfaces } from 'os';

function getIPAddress(): string {
  const interfaces = networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    if (iface) {
      for (let i = 0; i < iface.length; i++) {
        const alias: NetworkInterfaceInfo = iface[i];
        if (
          alias.family === 'IPv4' &&
          alias.address !== '127.0.0.1' &&
          !alias.internal
        ) {
          return alias.address;
        }
      }
    }
  }
  return '0.0.0.0';
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Apiato Base Project for NestJS')
    .setDescription('The leganux implementation of apiato')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Hacer pública la carpeta 'public'
  app.useStaticAssets(path.join(__dirname, '..', 'public'));

  app.enableCors();
  await app.listen(port);
  console.info(`
  __   ____  __   __  ____  __       __  ____ 
 / _\\ (  _ \\(  ) / _\\(_  _)/  \\    _(  )/ ___)
/    \\ ) __/ )( /    \\ )( (  O )_ / \\) \\\\___ \\
\\_/\\_/(__)  (__)\\_/\\_/(__) \\__/(_)\\____/(____/
                        (c) leganux.net 2021-2024  v. beta-0.0.1 NestJs - MongoDb
`);
  console.log(`Application is running on:
  
   - Welcome:
   Local: http://localhost:${port}
   Network: http://${getIPAddress()}:${port}
   
   - Docs:
   Local: http://localhost:${port}/api
   Network: http://${getIPAddress()}:${port}/api
   
   
   Made with ❤️ !!
   `);
}

bootstrap();
