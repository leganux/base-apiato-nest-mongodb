import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { rolesAndAccessConfig } from '../config/rolesAndAccess.config';

@Injectable()
export class AccessMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Entra al middleware', );

      let userRole: string = 'Public';
      let token = req?.headers?.authorization || '';

      token = token.replace('Bearer ', '');
      if (token && token.trim() != '') {
        const payload = this.jwtService.verify(token);
        const user = await this.userModel.findOne({ email: payload.email });

        userRole = user?.role || 'Public';
      }

      const routeConfig = this.getRouteConfig(req.path, req.method);

      if (!routeConfig || !routeConfig.roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          status: 403,
          message: 'Not Allowed',
          error: 'Unauthorized',
          data: {},
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(403).json({
        success: false,
        status: 403,
        message: 'Not Allowed',
        error: 'Unauthorized',
        data: {},
      });
    }
  }

  private getRouteConfig(path: string, method: string) {
    const routesConfig = Object.values(rolesAndAccessConfig).flatMap(
      (config) => config.routes,
    );
    return routesConfig.find(
      (route) =>
        route.path === path &&
        route.method.toLowerCase() === method.toLowerCase(),
    );
  }
}
