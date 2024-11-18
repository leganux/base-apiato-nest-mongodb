import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RolesAccess } from './schemas/roles-access.schema';
import { CreateRouteDto } from './dto/create-route.dto';
import { config } from 'dotenv';

export interface RouteConfig {
  path: string;
  method: string;
  roles: string[];
}

export interface ModuleConfig {
  routes: RouteConfig[];
  onlySpecial?: boolean | undefined | null;
}

interface SpecialConfigs {
  [key: string]: {
    onlySpecial?: boolean | undefined | null;
    routes: RouteConfig[];
  };
}

@Injectable()
export class RolesAccessService implements OnModuleInit {
  constructor(
    @InjectModel(RolesAccess.name)
    private rolesAccessModel: Model<RolesAccess>,
  ) { }

  async onModuleInit() {
    // Initialize with default configuration if empty
    const count = await this.rolesAccessModel.countDocuments();
    if (count === 0) {
      await this.initializeDefaultConfig();
    }
  }

  private async initializeDefaultConfig() {
    const rolesMap = {
      ALL: ['Admin', 'User', 'Public', 'Client', 'Editor', 'Accountant'],
      SUPER_ADMIN: ['Admin'],
      HEAD_ADMIN: ['Admin', 'Editor'],
      ADMIN: ['Admin', 'Editor', 'Accountant'],
      REGISTERED: ['Admin', 'User', 'Client', 'Editor', 'Accountant'],
      PUBLIC: ['Public'],
    };

    const modules = [
      'user',
      'auth',
      'files',
      'mail',
      'bill',
      'brand',
      'category',
      'discount',
      'measurement_unit',
      'payment',
      'product',
      'shipping',
      'supplier',
      'tax',
    ];

    const defaultRoutes: RouteConfig[] = [
      { path: '/', method: 'POST', roles: rolesMap.REGISTERED },
      { path: '/many', method: 'POST', roles: rolesMap.ADMIN },
      { path: '/', method: 'GET', roles: rolesMap.PUBLIC },
      { path: '/where', method: 'GET', roles: rolesMap.REGISTERED },
      { path: '/:id', method: 'GET', roles: rolesMap.PUBLIC },
      { path: '/:id', method: 'PUT', roles: rolesMap.HEAD_ADMIN },
      { path: '/updateOrCreate', method: 'PUT', roles: rolesMap.HEAD_ADMIN },
      { path: '/findAndUpdate', method: 'PUT', roles: rolesMap.HEAD_ADMIN },
      { path: '/:id', method: 'DELETE', roles: rolesMap.SUPER_ADMIN },
      { path: '/datatable', method: 'POST', roles: rolesMap.ADMIN },
      { path: '/schema', method: 'GET', roles: rolesMap.PUBLIC },
    ];

    const specialConfigs: SpecialConfigs = {
      auth: {
        onlySpecial: true,
        routes: [
          { path: '/register', method: 'POST', roles: rolesMap.PUBLIC },
          { path: '/login', method: 'POST', roles: rolesMap.PUBLIC },
          { path: '/verify-email', method: 'GET', roles: rolesMap.PUBLIC },
        ],
      },
      files: {
        onlySpecial: true,
        routes: [
          { path: '/upload', method: 'POST', roles: rolesMap.REGISTERED },
          { path: '/upload/many', method: 'POST', roles: rolesMap.REGISTERED },
          { path: '/view', method: 'GET', roles: rolesMap.ALL },
        ],
      },
      mail: {
        onlySpecial: true,
        routes: [{ path: '/send', method: 'POST', roles: rolesMap.ADMIN }],
      },
      payment: {
        routes: [{ path: '/pay', method: 'POST', roles: rolesMap.REGISTERED }],
      },
      shipping: {
        routes: [
          { path: '/auth', method: 'POST', roles: rolesMap.HEAD_ADMIN },
          {
            path: '/generate-quote',
            method: 'POST',
            roles: rolesMap.HEAD_ADMIN,
          },
          {
            path: '/generate-quote-with-addresses',
            method: 'POST',
            roles: rolesMap.HEAD_ADMIN,
          },
          {
            path: '/generate-label',
            method: 'POST',
            roles: rolesMap.HEAD_ADMIN,
          },
          {
            path: '/generate-label-with-addresses',
            method: 'POST',
            roles: rolesMap.HEAD_ADMIN,
          },
          {
            path: '/request-pickup',
            method: 'POST',
            roles: rolesMap.HEAD_ADMIN,
          },
          { path: '/track', method: 'POST', roles: rolesMap.HEAD_ADMIN },
          {
            path: '/track-multiple',
            method: 'POST',
            roles: rolesMap.HEAD_ADMIN,
          },
          { path: '/carriers', method: 'GET', roles: rolesMap.HEAD_ADMIN },
          { path: '/webhook', method: 'POST', roles: rolesMap.HEAD_ADMIN },
        ],
      },
      bill: {
        routes: [
          { path: '/:id/cancel', method: 'POST', roles: rolesMap.HEAD_ADMIN },
          { path: '/:id/pdf', method: 'GET', roles: rolesMap.PUBLIC },
          { path: '/:id/xml', method: 'GET', roles: rolesMap.PUBLIC },
          { path: '/user', method: 'GET', roles: rolesMap.REGISTERED },
          { path: '/payment/:id', method: 'GET', roles: rolesMap.REGISTERED },
          { path: '/:id', method: 'GET', roles: rolesMap.REGISTERED },
          {
            path: '/config/current',
            method: 'GET',
            roles: rolesMap.REGISTERED,
          },
          { path: '/config', method: 'PUT', roles: rolesMap.REGISTERED },
        ],
      },
    };

    const configs = modules.map((module) => {
      const defaultRoutesFiltered = defaultRoutes.filter(
        (defaultRoute) =>
          !specialConfigs[module]?.routes.find(
            (specialRoute) => specialRoute.path === defaultRoute.path,
          ),
      );
      if (specialConfigs[module]?.onlySpecial) {
        return {
          module,
          config: {
            routes: specialConfigs[module]?.routes,
          },
        };
      }
      return {
        module,
        config: {
          routes: [
            ...(specialConfigs[module]?.routes || []),
            ...defaultRoutesFiltered,
          ],
        },
      };
    });
    
    await this.rolesAccessModel.insertMany(configs);
  }

  async getConfig(module: string): Promise<RolesAccess> {
    const config = await this.rolesAccessModel.findOne({ module }).exec();
    if (!config) {
      throw new NotFoundException(
        `Configuration for module ${module} not found`,
      );
    }
    return config;
  }

  async getAllConfigs(): Promise<Record<string, ModuleConfig>> {
    const configs = await this.rolesAccessModel.find().exec();
    return configs.reduce<Record<string, ModuleConfig>>((acc, config) => {
      acc[config.module] = config.config;
      return acc;
    }, {});
  }

  async updateConfig(
    module: string,
    config: ModuleConfig,
  ): Promise<RolesAccess> {
    const updated = await this.rolesAccessModel
      .findOneAndUpdate({ module }, { config }, { new: true, upsert: true })
      .exec();

    if (!updated) {
      throw new Error(`Failed to update config for module: ${module}`);
    }

    return updated;
  }

  async addRoute(
    module: string,
    routeDto: CreateRouteDto,
  ): Promise<RolesAccess> {
    const config = await this.getConfig(module);
    config.config.routes.push(routeDto);
    const updated = await this.rolesAccessModel
      .findOneAndUpdate({ module }, { config: config.config }, { new: true })
      .exec();

    if (!updated) {
      throw new Error(`Failed to add route to module: ${module}`);
    }

    return updated;
  }

  async updateRoute(
    module: string,
    index: number,
    routeDto: CreateRouteDto,
  ): Promise<RolesAccess> {
    const config = await this.getConfig(module);
    if (index < 0 || index >= config.config.routes.length) {
      throw new NotFoundException(
        `Route index ${index} not found in module ${module}`,
      );
    }

    config.config.routes[index] = routeDto;
    const updated = await this.rolesAccessModel
      .findOneAndUpdate({ module }, { config: config.config }, { new: true })
      .exec();

    if (!updated) {
      throw new Error(`Failed to update route in module: ${module}`);
    }

    return updated;
  }

  async deleteRoute(module: string, index: number): Promise<RolesAccess> {
    const config = await this.getConfig(module);
    if (index < 0 || index >= config.config.routes.length) {
      throw new NotFoundException(
        `Route index ${index} not found in module ${module}`,
      );
    }

    config.config.routes.splice(index, 1);
    const updated = await this.rolesAccessModel
      .findOneAndUpdate({ module }, { config: config.config }, { new: true })
      .exec();

    if (!updated) {
      throw new Error(`Failed to delete route from module: ${module}`);
    }

    return updated;
  }
}
