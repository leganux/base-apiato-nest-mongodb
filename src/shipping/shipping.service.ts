import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Shipping } from './schemas/shipping.schema';
import { Model } from 'mongoose';
import {
  ApiatoService,
  IResponse,
  Responses,
} from 'src/core/apiato/apiato.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

import { GenerateQuoteDto } from './dto/generateQuote.dto';
import { EnviaAuthDto } from './dto/envia-auth.dto';
import { GenerateLabelDto } from './dto/generate-label.dto';
import { RequestPickupDto } from './dto/request-pickup.dto';
import {
  TrackShipmentDto,
  TrackMultipleShipmentsDto,
} from './dto/track-shipment.dto';
import {
  ShippingStatusEnum,
  ShippingCarrierEnum,
} from './interfaces/shipping.interface';
import { UserAddress } from '../user/schemas/user-address.schema';

@Injectable()
export class ShippingService extends ApiatoService<
  Shipping,
  CreateShippingDto,
  UpdateShippingDto
> {
  private enviaApiKey: string;
  private enviaApiUrl: string;
  private authToken: string;

  constructor(
    @InjectModel(Shipping.name) private shippingModel: Model<Shipping>,
    @InjectModel(UserAddress.name) private userAddressModel: Model<UserAddress>,
    private configService: ConfigService,
  ) {
    super(shippingModel, {});
    const environment =
      this.configService.get<string>('NODE_ENV') || 'development';
    const isSandbox = environment !== 'production';

    this.enviaApiUrl = isSandbox
      ? 'https://sandbox.envia.com/api' // Sandbox URL
      : 'https://api.envia.com/api'; // Production URL

    this.enviaApiKey = this.configService.get<string>('ENVIA_API_KEY') || '';
  }

  private async getHeaders() {
    return {
      Authorization: `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
    };
  }

  private formatAddressForEnvia(address: UserAddress) {
    return {
      postal_code: address.postal_code,
      country_code: address.country,
      state_code: address.state,
      city: address.city,
      street: address.street,
      reference: address.reference,
      phone: address.phone,
      email: address.email,
      name: address.name,
    };
  }

  private async getAddressById(
    addressId: string,
    userId: string,
  ): Promise<UserAddress> {
    const address = await this.userAddressModel.findOne({
      _id: addressId,
      user: userId,
      deletedAt: null,
    });

    if (!address) {
      throw new HttpException('Address not found', HttpStatus.NOT_FOUND);
    }

    return address;
  }

  async authenticate(authDto: EnviaAuthDto): Promise<IResponse> {
    try {
      const response = await axios.post(`${this.enviaApiUrl}/auth`, {
        api_key: authDto.apiKey,
      });

      if (response.data.token) {
        this.authToken = response.data.token;
        return Responses.success(
          { token: this.authToken },
          'Authentication successful',
        );
      }

      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    } catch (error) {
      console.error('Authentication error:', error);
      return Responses.badRequest(
        error.response?.data?.message || 'Authentication failed',
      );
    }
  }

  async generateQuoteWithStoredAddresses(
    userId: string,
    originAddressId: string,
    destinationAddressId: string,
    packages: any[],
    carriers?: ShippingCarrierEnum[],
  ): Promise<IResponse> {
    try {
      // Get addresses from database
      const originAddress = await this.getAddressById(originAddressId, userId);
      const destinationAddress = await this.getAddressById(
        destinationAddressId,
        userId,
      );

      const quoteData: GenerateQuoteDto = {
        origin: this.formatAddressForEnvia(originAddress),
        destination: this.formatAddressForEnvia(destinationAddress),
        packages,
        carriers,
      };

      return this.generateQuote(quoteData, {});
    } catch (error) {
      console.error('Generate quote error:', error);
      return Responses.badRequest(error.message || 'Failed to generate quote');
    }
  }

  async generateQuote(
    generateQuoteBody: GenerateQuoteDto,
    query: any,
  ): Promise<IResponse> {
    try {
      if (!this.authToken) {
        throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const response = await axios.post(
        `${this.enviaApiUrl}/ship/rate`,
        generateQuoteBody,
        { headers: await this.getHeaders() },
      );

      return Responses.success(response.data, 'Quote generated successfully');
    } catch (error) {
      console.error('Generate quote error:', error);
      return Responses.badRequest(
        error.response?.data?.message || 'Failed to generate quote',
      );
    }
  }

  async generateLabelWithStoredAddresses(
    userId: string,
    originAddressId: string,
    destinationAddressId: string,
    labelData: Partial<GenerateLabelDto>,
  ): Promise<IResponse> {
    try {
      // Get addresses from database
      const originAddress = await this.getAddressById(originAddressId, userId);
      const destinationAddress = await this.getAddressById(
        destinationAddressId,
        userId,
      );

      const fullLabelData: GenerateLabelDto = {
        ...labelData,
        origin: this.formatAddressForEnvia(originAddress),
        destination: this.formatAddressForEnvia(destinationAddress),
      } as GenerateLabelDto;

      return this.generateLabel(fullLabelData);
    } catch (error) {
      console.error('Generate label error:', error);
      return Responses.badRequest(error.message || 'Failed to generate label');
    }
  }

  async generateLabel(generateLabelDto: GenerateLabelDto): Promise<IResponse> {
    try {
      if (!this.authToken) {
        throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const response = await axios.post(
        `${this.enviaApiUrl}/ship/generate`,
        generateLabelDto,
        { headers: await this.getHeaders() },
      );

      // Save shipping information to database
      const shipping = new this.shippingModel({
        carrier: generateLabelDto.carrier,
        status: ShippingStatusEnum.LABELED,
        date_labeled: new Date(),
        tracking_number: response.data.tracking_number,
        label_url: response.data.label_url,
        origin: generateLabelDto.origin,
        destination: generateLabelDto.destination,
        packages: generateLabelDto.packages,
      });
      await shipping.save();

      return Responses.success(response.data, 'Label generated successfully');
    } catch (error) {
      console.error('Generate label error:', error);
      return Responses.badRequest(
        error.response?.data?.message || 'Failed to generate label',
      );
    }
  }

  async requestPickup(requestPickupDto: RequestPickupDto): Promise<IResponse> {
    try {
      if (!this.authToken) {
        throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const response = await axios.post(
        `${this.enviaApiUrl}/ship/pickup`,
        requestPickupDto,
        { headers: await this.getHeaders() },
      );

      // Update shipping status
      await this.shippingModel.findByIdAndUpdate(requestPickupDto.shipping_id, {
        status: ShippingStatusEnum.PICKED_UP,
        date_picked_up: new Date(),
      });

      return Responses.success(response.data, 'Pickup requested successfully');
    } catch (error) {
      console.error('Request pickup error:', error);
      return Responses.badRequest(
        error.response?.data?.message || 'Failed to request pickup',
      );
    }
  }

  async trackShipment(trackShipmentDto: TrackShipmentDto): Promise<IResponse> {
    try {
      if (!this.authToken) {
        throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const response = await axios.get(
        `${this.enviaApiUrl}/ship/track/${trackShipmentDto.tracking_number}`,
        { headers: await this.getHeaders() },
      );

      // Update shipping status if needed
      await this.shippingModel.findByIdAndUpdate(trackShipmentDto.shipping_id, {
        status: ShippingStatusEnum.ON_TRACK,
        date_tracked: new Date(),
      });

      return Responses.success(
        response.data,
        'Tracking information retrieved successfully',
      );
    } catch (error) {
      console.error('Track shipment error:', error);
      return Responses.badRequest(
        error.response?.data?.message || 'Failed to track shipment',
      );
    }
  }

  async trackMultipleShipments(
    trackMultipleDto: TrackMultipleShipmentsDto,
  ): Promise<IResponse> {
    try {
      if (!this.authToken) {
        throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const response = await axios.post(
        `${this.enviaApiUrl}/ship/track/multiple`,
        trackMultipleDto,
        { headers: await this.getHeaders() },
      );

      return Responses.success(
        response.data,
        'Multiple tracking information retrieved successfully',
      );
    } catch (error) {
      console.error('Track multiple shipments error:', error);
      return Responses.badRequest(
        error.response?.data?.message || 'Failed to track multiple shipments',
      );
    }
  }

  async getCarriers(): Promise<IResponse> {
    try {
      if (!this.authToken) {
        throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
      }

      const response = await axios.get(`${this.enviaApiUrl}/carriers`, {
        headers: await this.getHeaders(),
      });

      return Responses.success(
        response.data,
        'Carriers retrieved successfully',
      );
    } catch (error) {
      console.error('Get carriers error:', error);
      return Responses.badRequest(
        error.response?.data?.message || 'Failed to get carriers',
      );
    }
  }

  async handleWebhook(webhookData: any): Promise<IResponse> {
    try {
      const { tracking_number, status, status_detail, timestamp } = webhookData;

      // Find shipping by tracking number
      const shipping = await this.shippingModel.findOne({ tracking_number });

      if (!shipping) {
        return Responses.notFound('Shipping not found');
      }

      // Map envia.com status to our status enum
      let shippingStatus: ShippingStatusEnum;
      switch (status.toLowerCase()) {
        case 'in_transit':
          shippingStatus = ShippingStatusEnum.ON_TRACK;
          break;
        case 'delivered':
          shippingStatus = ShippingStatusEnum.DELIVERED;
          break;
        case 'exception':
          shippingStatus = ShippingStatusEnum.REJECTED;
          break;
        default:
          shippingStatus = shipping.status;
      }

      // Update shipping status
      await this.shippingModel.findByIdAndUpdate(shipping._id, {
        status: shippingStatus,
        date_tracked: new Date(timestamp),
        $push: {
          webhooks: {
            status,
            status_detail,
            timestamp: new Date(timestamp),
            raw_data: webhookData,
          },
        },
      });

      return Responses.success(
        { status: shippingStatus },
        'Webhook processed successfully',
      );
    } catch (error) {
      console.error('Webhook processing error:', error);
      return Responses.badRequest('Failed to process webhook');
    }
  }
}
