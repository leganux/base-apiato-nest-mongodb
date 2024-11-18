import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Put, 
  UseGuards,
  Req,
  Res,
  BadRequestException,
  StreamableFile
} from '@nestjs/common';
import { Response } from 'express';
import { BillService } from './services/bill.service';
import { FacturamaService } from './services/facturama.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillConfigDto } from './dto/update-bill-config.dto';




@Controller('bills')
export class BillController {
  constructor(
    private readonly billService: BillService,
    private readonly facturamaService: FacturamaService,
  ) {}

  @Post()
  async create(@Body() createBillDto: CreateBillDto, @Req() req: any) {
    return this.billService.create(createBillDto, req.user._id);
  }

  @Post(':id/cancel')
  async cancel(
    @Param('id') id: string,
    @Body('motive') motive: string,
  ) {
    if (!motive) {
      throw new BadRequestException('Cancellation motive is required');
    }
    return this.billService.cancel(id, motive);
  }

  @Get(':id/pdf')
  async downloadPDF(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const pdfBuffer = await this.billService.downloadPDF(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bill-${id}.pdf"`,
    });

    return new StreamableFile(pdfBuffer);
  }

  @Get(':id/xml')
  async downloadXML(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const xmlBuffer = await this.billService.downloadXML(id);
    
    res.set({
      'Content-Type': 'application/xml',
      'Content-Disposition': `attachment; filename="bill-${id}.xml"`,
    });

    return new StreamableFile(xmlBuffer);
  }

  @Get('user')
  async findUserBills(@Req() req: any) {
    return this.billService.findByUser(req.user._id);
  }

  @Get('payment/:paymentId')
  async findPaymentBills(@Param('paymentId') paymentId: string) {
    return this.billService.findByPayment(paymentId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.billService.findOne(id);
  }

  // Configuration endpoints (admin only)
  @Get('config/current')
  async getConfig() {
    return this.facturamaService.getConfig();
  }

  @Put('config')
  async updateConfig(@Body() updateConfigDto: UpdateBillConfigDto) {
    return this.facturamaService.updateConfig(updateConfigDto);
  }
}
