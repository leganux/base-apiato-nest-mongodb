import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RolesAccessService } from './roles-access.service';
import { CreateRouteDto } from './dto/create-route.dto';

@Controller('api/v1/config/roles-access')
export class RolesAccessController {
    constructor(private readonly rolesAccessService: RolesAccessService) { }

    @Get()
    async getAllConfigs() {
        const configs = await this.rolesAccessService.getAllConfigs();
        return {
            success: true,
            status: 200,
            message: 'Roles and access configurations retrieved successfully',
            data: configs,
        };
    }

    @Get(':module')
    async getModuleConfig(@Param('module') module: string) {
        const config = await this.rolesAccessService.getConfig(module);
        return {
            success: true,
            status: 200,
            message: `Configuration for module ${module} retrieved successfully`,
            data: config,
        };
    }

    @Post(':module/route')
    async addRoute(
        @Param('module') module: string,
        @Body() createRouteDto: CreateRouteDto,
    ) {
        const updatedConfig = await this.rolesAccessService.addRoute(module, createRouteDto);
        return {
            success: true,
            status: 200,
            message: `Route added to module ${module} successfully`,
            data: updatedConfig,
        };
    }

    @Put(':module/route/:index')
    async updateRoute(
        @Param('module') module: string,
        @Param('index') index: number,
        @Body() updateRouteDto: CreateRouteDto,
    ) {
        const updatedConfig = await this.rolesAccessService.updateRoute(
            module,
            index,
            updateRouteDto,
        );
        return {
            success: true,
            status: 200,
            message: `Route updated in module ${module} successfully`,
            data: updatedConfig,
        };
    }

    @Delete(':module/route/:index')
    async deleteRoute(
        @Param('module') module: string,
        @Param('index') index: number,
    ) {
        const updatedConfig = await this.rolesAccessService.deleteRoute(module, index);
        return {
            success: true,
            status: 200,
            message: `Route deleted from module ${module} successfully`,
            data: updatedConfig,
        };
    }
}
