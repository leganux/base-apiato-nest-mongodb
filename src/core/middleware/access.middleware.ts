import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { rolesAndAccessConfig } from '../config/rolesAndAccess.config';

function compareRoutes(templateRoute: string, actualRoute: string): boolean {
  if (actualRoute.endsWith('/') && !templateRoute.endsWith('/')) {
    templateRoute = templateRoute + '/';
  }
  if (!actualRoute.endsWith('/') && templateRoute.endsWith('/')) {
    actualRoute = actualRoute + '/';
  }

  const templateRouteSplit = templateRoute.split('/');
  const actualRouteSplit = actualRoute.split('/');

  if (templateRouteSplit.length !== actualRouteSplit.length) {
    return false;
  }

  for (let index = 0; index < templateRouteSplit.length; index++) {
    const templateSegment = templateRouteSplit[index];
    if (templateSegment.startsWith(':')) {
      actualRouteSplit[index] = templateSegment;
    }
  }

  actualRoute = actualRouteSplit.join('/');

  if (templateRoute.endsWith('/') !== actualRoute.endsWith('/')) {
    actualRoute = actualRoute + '/';
  }

  return actualRoute == templateRoute;
}

@Injectable()
export class AccessMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      let userRole: string = 'Public';
      let token = req?.headers?.authorization || '';

      token = token.replace('Bearer ', '');
      if (token && token.trim() != '') {
        const payload = this.jwtService.verify(token);
        const user = await this.userModel.findOne({ email: payload.email });
        userRole = user?.role || 'Public';
      }
      let route = req.path;

      if (!route.endsWith('/')) {
        route = route + '/';
      }

      route = req.method.toUpperCase() + '$$' + route;
      if (route.includes('?')) {
        route = route.split('?')[0];
      }

      let goNext = false;

      for (const [key, val] of Object.entries(rolesAndAccessConfig)) {
        for (const item of val.routes) {
          const s =
            item.method.toUpperCase() +
            '$$' +
            '/api/v1/' +
            key +
            item.path.trim();
          if (s.includes(':')) {
            const compare = compareRoutes(s, route);
            if (compare && item.roles.includes(userRole)) {
              goNext = true;
            }
          } else {
            if (s == route && item.roles.includes(userRole)) {
              goNext = true;
              break;
            }
          }
        }
      }

      if (goNext) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          status: 403,
          message: 'Not Allowed',
          error: 'Unauthorized',
          data: {},
        });
      }
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
