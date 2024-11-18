import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bill } from '../schemas/bill.schema';
import { BillConfig } from '../schemas/bill-config.schema';
import { CreateBillDto } from '../dto/create-bill.dto';
import { FacturamaService } from './facturama.service';
import { BillStatus, FacturaCFDI, FacturamaCustomer } from '../interfaces/facturama.interface';
import { UserAddress } from '../../user/schemas/user-address.schema';

@Injectable()
export class BillService {
  private readonly logger = new Logger(BillService.name);

  constructor(
    @InjectModel(Bill.name) private billModel: Model<Bill>,
    @InjectModel(BillConfig.name) private billConfigModel: Model<BillConfig>,
    @InjectModel(UserAddress.name) private userAddressModel: Model<UserAddress>,
    private readonly facturamaService: FacturamaService,
  ) {}

  async create(createBillDto: CreateBillDto, userId: string): Promise<Bill> {
    try {
      // Validate RFC
      const isValidRFC = await this.facturamaService.validateRFC(createBillDto.rfc);
      if (!isValidRFC) {
        throw new BadRequestException('Invalid RFC');
      }

      // Get address details
      const address = await this.userAddressModel.findById(createBillDto.address);
      if (!address) {
        throw new NotFoundException('Address not found');
      }

      // Create bill document
      const bill = await this.billModel.create({
        ...createBillDto,
        user: userId,
        status: BillStatus.PENDING
      });

      // Create customer in Facturama
      const customer: FacturamaCustomer = {
        Email: createBillDto.email,
        Rfc: createBillDto.rfc,
        Name: createBillDto.businessName,
        FiscalRegime: '601', // Default to general regime
        CfdiUse: createBillDto.cfdiUse,
        TaxZipCode: address.postal_code,
        Address: {
          Street: address.street,
          ExteriorNumber: address.exterior_number || '',
          InteriorNumber: address.interior_number,
          Neighborhood: address.neighborhood || '',
          ZipCode: address.postal_code,
          Locality: address.city,
          Municipality: address.municipality || address.city,
          State: address.state,
          Country: address.country,
        }
      };

      const facturamaCustomer = await this.facturamaService.createCustomer(customer);

      // Get payment details and create CFDI
      const payment = await bill.populate('paymentDetails');
      const config = await this.billConfigModel.findOne({ isActive: true });
      if (!config) {
        throw new BadRequestException('Bill configuration not found');
      }

      const cfdi: FacturaCFDI = {
        Serie: config.defaultSettings?.serie || 'A',
        Currency: config.defaultSettings?.currency || 'MXN',
        ExpeditionPlace: config.defaultSettings?.expeditionPlace || address.postal_code,
        PaymentForm: createBillDto.paymentForm,
        PaymentMethod: createBillDto.paymentMethod,
        CfdiType: 'I',
        Receiver: facturamaCustomer,
        Items: [
          {
            ProductCode: '01010101',
            IdentificationNumber: payment._id.toString(),
            Description: `Payment for order ${payment.get('paymentDetails.order')}`,
            Unit: 'Service',
            UnitCode: 'E48',
            UnitPrice: payment.get('paymentDetails.total'),
            Quantity: 1,
            Subtotal: payment.get('paymentDetails.total'),
            TaxObject: "02",
            Taxes: [
              {
                Total: payment.get('paymentDetails.total') * 0.16,
                Name: "IVA",
                Base: payment.get('paymentDetails.total'),
                Rate: 0.16,
                IsRetention: false
              }
            ],
            Total: payment.get('paymentDetails.total') * 1.16
          }
        ]
      };

      // Generate CFDI
      const response = await this.facturamaService.createCFDI(cfdi);

      // Update bill with Facturama response
      const updatedBill = await this.billModel.findByIdAndUpdate(
        bill._id,
        {
          facturamaId: response.Id,
          uuid: response.Complement?.TaxStamp?.Uuid,
          serie: response.Serie,
          folio: response.Folio,
          pdfUrl: response.PdfUrl,
          xmlUrl: response.XmlUrl,
          status: BillStatus.GENERATED,
          facturamaResponse: response,
          generatedAt: new Date()
        },
        { new: true }
      );

      if (!updatedBill) {
        throw new NotFoundException('Failed to update bill');
      }

      return updatedBill;
    } catch (error) {
      this.logger.error('Failed to create bill:', error);
      
      // Update bill status to ERROR if it was created
      if (error.billId) {
        await this.billModel.findByIdAndUpdate(error.billId, {
          status: BillStatus.ERROR,
          error: {
            message: error.message,
            details: error.response?.data || error
          }
        });
      }
      
      throw error;
    }
  }

  async cancel(id: string, motive: string): Promise<Bill> {
    const bill = await this.billModel.findById(id);
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    if (bill.status !== BillStatus.GENERATED) {
      throw new BadRequestException('Can only cancel generated bills');
    }

    if (!bill.facturamaId) {
      throw new BadRequestException('Bill has no Facturama ID');
    }

    try {
      await this.facturamaService.cancelCFDI(bill.facturamaId, motive);

      const cancelledBill = await this.billModel.findByIdAndUpdate(
        id,
        {
          status: BillStatus.CANCELLED,
          cancelationReason: motive,
          cancelledAt: new Date()
        },
        { new: true }
      );

      if (!cancelledBill) {
        throw new NotFoundException('Failed to update cancelled bill');
      }

      return cancelledBill;
    } catch (error) {
      this.logger.error(`Failed to cancel bill ${id}:`, error);
      throw error;
    }
  }

  async downloadPDF(id: string): Promise<Buffer> {
    const bill = await this.billModel.findById(id);
    if (!bill || !bill.facturamaId) {
      throw new NotFoundException('Bill not found or not generated');
    }

    return this.facturamaService.downloadPDF(bill.facturamaId);
  }

  async downloadXML(id: string): Promise<Buffer> {
    const bill = await this.billModel.findById(id);
    if (!bill || !bill.facturamaId) {
      throw new NotFoundException('Bill not found or not generated');
    }

    return this.facturamaService.downloadXML(bill.facturamaId);
  }

  async findOne(id: string): Promise<Bill> {
    const bill = await this.billModel.findById(id)
      .populate('paymentDetails')
      .populate('userDetails')
      .populate('addressDetails');
    
    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    return bill;
  }

  async findByUser(userId: string): Promise<Bill[]> {
    return this.billModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('paymentDetails')
      .populate('addressDetails');
  }

  async findByPayment(paymentId: string): Promise<Bill[]> {
    return this.billModel.find({ payment: paymentId })
      .sort({ createdAt: -1 })
      .populate('userDetails')
      .populate('addressDetails');
  }
}
