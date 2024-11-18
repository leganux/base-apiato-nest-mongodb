import {
  Body,
  Controller,
  Post,
  Get,
  Query as QueryParams,
  Res,
  Headers,
  HttpCode,
  RawBodyRequest,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { ShippingService } from './shipping.service';
import { ApiatoController } from '../core/apiato/apiato.controller';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { IResponse } from '../core/apiato/apiato.service';
import { GenerateQuoteDto } from './dto/generateQuote.dto';
import { EnviaAuthDto } from './dto/envia-auth.dto';
import { GenerateLabelDto } from './dto/generate-label.dto';
import { RequestPickupDto } from './dto/request-pickup.dto';
import {
  TrackShipmentDto,
  TrackMultipleShipmentsDto,
} from './dto/track-shipment.dto';
import { GenerateQuoteWithAddressesDto } from './dto/generate-quote-with-addresses.dto';
import { GenerateLabelWithAddressesDto } from './dto/generate-label-with-addresses.dto';

@ApiTags('Shipping')
@Controller('/api/v1/shipping')
export class ShippingController extends ApiatoController<
  CreateShippingDto,
  UpdateShippingDto,
  ShippingService
> {
  constructor(private readonly shippingService: ShippingService) {
    super(shippingService);
  }

  @Post('/auth')
  @ApiOperation({ summary: 'Authenticate with envia.com API' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  async authenticate(@Body() authDto: EnviaAuthDto, @Res() res: Response) {
    const resp: IResponse = await this.shippingService.authenticate(authDto);
    return res.status(resp.status).json(resp);
  }

  @Post('/generate-quote')
  @ApiOperation({ summary: 'Generate shipping quote' })
  @ApiResponse({ status: 200, description: 'Quote generated successfully' })
  async generateQuote(
    @Body() generateQuoteDto: GenerateQuoteDto,
    @Res() res: Response,
    @QueryParams() query: any,
  ) {
    const resp: IResponse = await this.shippingService.generateQuote(
      generateQuoteDto,
      query,
    );
    return res.status(resp.status).json(resp);
  }

  @Post('/generate-quote-with-addresses')
  @ApiOperation({ summary: 'Generate shipping quote using stored addresses' })
  @ApiResponse({ status: 200, description: 'Quote generated successfully' })
  async generateQuoteWithAddresses(
    @Body() quoteDto: GenerateQuoteWithAddressesDto,
    @QueryParams('userId') userId: string,
    @Res() res: Response,
  ) {
    const resp: IResponse =
      await this.shippingService.generateQuoteWithStoredAddresses(
        userId,
        quoteDto.originAddressId,
        quoteDto.destinationAddressId,
        quoteDto.packages,
        quoteDto.carriers,
      );
    return res.status(resp.status).json(resp);
  }

  @Post('/generate-label')
  @ApiOperation({ summary: 'Generate shipping label' })
  @ApiResponse({ status: 200, description: 'Label generated successfully' })
  async generateLabel(
    @Body() generateLabelDto: GenerateLabelDto,
    @Res() res: Response,
  ) {
    const resp: IResponse =
      await this.shippingService.generateLabel(generateLabelDto);
    return res.status(resp.status).json(resp);
  }

  @Post('/generate-label-with-addresses')
  @ApiOperation({ summary: 'Generate shipping label using stored addresses' })
  @ApiResponse({ status: 200, description: 'Label generated successfully' })
  async generateLabelWithAddresses(
    @Body() labelDto: GenerateLabelWithAddressesDto,
    @QueryParams('userId') userId: string,
    @Res() res: Response,
  ) {
    const resp: IResponse =
      await this.shippingService.generateLabelWithStoredAddresses(
        userId,
        labelDto.originAddressId,
        labelDto.destinationAddressId,
        labelDto,
      );
    return res.status(resp.status).json(resp);
  }

  @Post('/request-pickup')
  @ApiOperation({ summary: 'Request pickup for shipment' })
  @ApiResponse({ status: 200, description: 'Pickup requested successfully' })
  async requestPickup(
    @Body() requestPickupDto: RequestPickupDto,
    @Res() res: Response,
  ) {
    const resp: IResponse =
      await this.shippingService.requestPickup(requestPickupDto);
    return res.status(resp.status).json(resp);
  }

  @Post('/track')
  @ApiOperation({ summary: 'Track single shipment' })
  @ApiResponse({
    status: 200,
    description: 'Tracking information retrieved successfully',
  })
  async trackShipment(
    @Body() trackShipmentDto: TrackShipmentDto,
    @Res() res: Response,
  ) {
    const resp: IResponse =
      await this.shippingService.trackShipment(trackShipmentDto);
    return res.status(resp.status).json(resp);
  }

  @Post('/track-multiple')
  @ApiOperation({ summary: 'Track multiple shipments' })
  @ApiResponse({
    status: 200,
    description: 'Multiple tracking information retrieved successfully',
  })
  async trackMultipleShipments(
    @Body() trackMultipleDto: TrackMultipleShipmentsDto,
    @Res() res: Response,
  ) {
    const resp: IResponse =
      await this.shippingService.trackMultipleShipments(trackMultipleDto);
    return res.status(resp.status).json(resp);
  }

  @Get('/carriers')
  @ApiOperation({ summary: 'Get available carriers' })
  @ApiResponse({
    status: 200,
    description: 'Carriers list retrieved successfully',
  })
  async getCarriers(@Res() res: Response) {
    const resp: IResponse = await this.shippingService.getCarriers();
    return res.status(resp.status).json(resp);
  }

  @Post('/webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Handle envia.com webhooks' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiHeader({
    name: 'X-Envia-Signature',
    description: 'Webhook signature for verification',
  })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-envia-signature') signature: string,
    @Body() webhookData: any,
    @Res() res: Response,
  ) {
    // Verify webhook signature if provided by envia.com
    if (signature) {
      // Here you would implement signature verification
      // const isValid = this.verifyWebhookSignature(signature, req.rawBody);
      // if (!isValid) {
      //   return res.status(401).json({ message: 'Invalid webhook signature' });
      // }
    }

    const resp: IResponse =
      await this.shippingService.handleWebhook(webhookData);
    return res.status(resp.status).json(resp);
  }
}
