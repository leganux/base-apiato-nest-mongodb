import { Injectable } from '@nestjs/common';
import * as os from 'os';
import * as process from 'node:process';
import { networkInterfaces, NetworkInterfaceInfo } from 'os';

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

@Injectable()
export class WelcomesService {
  home() {
    const stats = {
      arch: os.arch(),
      freemem: os.freemem(),
      homedir: os.homedir(),
      hostname: os.hostname(),
      machine: os.machine(),
      release: os.release(),
      platform: os.platform(),
      uptime: os.uptime(),
      totalmem: os.totalmem(),
      userinfo: os.userInfo(),
      network: os.networkInterfaces(),
      cpus: os.cpus(),
    };

    return {
      status: 200,
      message: 'Welcome to leganux server - NestJS/Apiato/Mongo',
      credits: '(C) Leganux 2007 - 2024',
      data: {},
      error: null,
      license: 'MIT',
      docs: `http://${getIPAddress()}:${process.env.PORT}/api`,
      npm_docs: 'https://www.npmjs.com/package/apiato',
      stats: stats,
    };
  }
}
