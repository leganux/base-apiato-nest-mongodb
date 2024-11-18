import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ApiatoService, IResponse, Responses } from 'src/core/apiato/apiato.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UserAddress } from './schemas/user-address.schema';
import { ShippingRangeEnum } from '../shipping/interfaces/shipping.interface';

@Injectable()
export class UserService extends ApiatoService<User, CreateUserDto, UpdateUserDto> {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserAddress.name) private userAddressModel: Model<UserAddress>,
  ) {
    super(userModel, {});
  }

  async createAddress(
    userId: string,
    createAddressDto: CreateUserAddressDto,
  ): Promise<IResponse> {
    try {
      // Check if user exists
      const user = await this.userModel.findById(userId);
      if (!user) {
        return Responses.notFound('User not found');
      }

      // If this is the first address or is_default is true, unset any existing default
      if (createAddressDto.is_default) {
        await this.userAddressModel.updateMany(
          { user: userId },
          { $set: { is_default: false } },
        );
      }

      // Create new address
      const address = new this.userAddressModel({
        ...createAddressDto,
        user: userId,
      });
      await address.save();

      return Responses.success(address, 'Address created successfully');
    } catch (error) {
      console.error('Create address error:', error);
      return Responses.internalServerError('Failed to create address');
    }
  }

  async getAddresses(
    userId: string,
    range?: ShippingRangeEnum,
  ): Promise<IResponse> {
    try {
      // Check if user exists
      const user = await this.userModel.findById(userId);
      if (!user) {
        return Responses.notFound('User not found');
      }

      // Build query
      const query: any = { user: userId, deletedAt: null };
      if (range) {
        query.range = range;
      }

      // Get addresses
      const addresses = await this.userAddressModel.find(query).sort({ is_default: -1 });

      return Responses.success(addresses, 'Addresses retrieved successfully');
    } catch (error) {
      console.error('Get addresses error:', error);
      return Responses.internalServerError('Failed to retrieve addresses');
    }
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: CreateUserAddressDto,
  ): Promise<IResponse> {
    try {
      // Check if address exists and belongs to user
      const address = await this.userAddressModel.findOne({
        _id: addressId,
        user: userId,
      });

      if (!address) {
        return Responses.notFound('Address not found');
      }

      // If setting as default, unset any existing default
      if (updateAddressDto.is_default) {
        await this.userAddressModel.updateMany(
          { user: userId },
          { $set: { is_default: false } },
        );
      }

      // Update address
      const updatedAddress = await this.userAddressModel.findByIdAndUpdate(
        addressId,
        updateAddressDto,
        { new: true },
      );

      return Responses.success(updatedAddress, 'Address updated successfully');
    } catch (error) {
      console.error('Update address error:', error);
      return Responses.internalServerError('Failed to update address');
    }
  }

  async deleteAddress(userId: string, addressId: string): Promise<IResponse> {
    try {
      // Check if address exists and belongs to user
      const address = await this.userAddressModel.findOne({
        _id: addressId,
        user: userId,
      });

      if (!address) {
        return Responses.notFound('Address not found');
      }

      // Soft delete the address
      await this.userAddressModel.findByIdAndUpdate(addressId, {
        deletedAt: new Date(),
      });

      return Responses.success(null, 'Address deleted successfully');
    } catch (error) {
      console.error('Delete address error:', error);
      return Responses.internalServerError('Failed to delete address');
    }
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<IResponse> {
    try {
      // Check if address exists and belongs to user
      const address = await this.userAddressModel.findOne({
        _id: addressId,
        user: userId,
      });

      if (!address) {
        return Responses.notFound('Address not found');
      }

      // Unset any existing default
      await this.userAddressModel.updateMany(
        { user: userId },
        { $set: { is_default: false } },
      );

      // Set new default
      const updatedAddress = await this.userAddressModel.findByIdAndUpdate(
        addressId,
        { is_default: true },
        { new: true },
      );

      return Responses.success(updatedAddress, 'Address set as default successfully');
    } catch (error) {
      console.error('Set default address error:', error);
      return Responses.internalServerError('Failed to set default address');
    }
  }
}
