import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query as QueryParams,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { IResponse } from '../core/apiato/apiato.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { ShippingRangeEnum } from '../shipping/interfaces/shipping.interface';

@ApiTags('User')
@Controller('/api/v1/user')
export class UserController extends ApiatoController<
  CreateUserDto,
  UpdateUserDto,
  UserService
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Post('/:userId/addresses')
  @ApiOperation({ summary: 'Create user shipping address' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  async createAddress(
    @Param('userId') userId: string,
    @Body() createAddressDto: CreateUserAddressDto,
    @Res() res: Response,
  ) {
    const resp: IResponse = await this.userService.createAddress(userId, createAddressDto);
    return res.status(resp.status).json(resp);
  }

  @Get('/:userId/addresses')
  @ApiOperation({ summary: 'Get user shipping addresses' })
  @ApiResponse({ status: 200, description: 'Addresses retrieved successfully' })
  async getAddresses(
    @Param('userId') userId: string,
    @Res() res: Response,
    @QueryParams('range') range?: ShippingRangeEnum,
  ) {
    const resp: IResponse = await this.userService.getAddresses(userId, range);
    return res.status(resp.status).json(resp);
  }

  @Put('/:userId/addresses/:addressId')
  @ApiOperation({ summary: 'Update user shipping address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  async updateAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: CreateUserAddressDto,
    @Res() res: Response,
  ) {
    const resp: IResponse = await this.userService.updateAddress(
      userId,
      addressId,
      updateAddressDto,
    );
    return res.status(resp.status).json(resp);
  }

  @Delete('/:userId/addresses/:addressId')
  @ApiOperation({ summary: 'Delete user shipping address' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  async deleteAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
    @Res() res: Response,
  ) {
    const resp: IResponse = await this.userService.deleteAddress(userId, addressId);
    return res.status(resp.status).json(resp);
  }

  @Post('/:userId/addresses/:addressId/set-default')
  @ApiOperation({ summary: 'Set address as default' })
  @ApiResponse({ status: 200, description: 'Address set as default successfully' })
  async setDefaultAddress(
    @Param('userId') userId: string,
    @Param('addressId') addressId: string,
    @Res() res: Response,
  ) {
    const resp: IResponse = await this.userService.setDefaultAddress(userId, addressId);
    return res.status(resp.status).json(resp);
  }
}
