import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios, { AxiosInstance } from 'axios';
import { BillConfig } from '../schemas/bill-config.schema';
import { Bill } from '../schemas/bill.schema';
import { FacturamaConfig, FacturamaCustomer, FacturaCFDI, FacturamaResponse } from '../interfaces/facturama.interface';
import { defaultBillConfig } from '../schemas/bill-config.schema';

@Injectable()
export class FacturamaService implements OnModuleInit {
  private readonly logger = new Logger(FacturamaService.name);
  private axiosInstance: AxiosInstance;
  private config: FacturamaConfig;

  constructor(
    @InjectModel(BillConfig.name) private billConfigModel: Model<BillConfig>,
    @InjectModel(Bill.name) private billModel: Model<Bill>,
  ) {}

  async onModuleInit() {
    await this.initializeConfig();
  }

  private async initializeConfig() {
    try {
      let config = await this.billConfigModel.findOne({ is_active: true });
      
      if (!config) {
        config = await this.billConfigModel.create(defaultBillConfig);
      }

      this.config = {
        is_development: config.is_development,
        sandbox: {
          base_url: config.sandbox.base_url,
          username: config.sandbox.username,
          password: config.sandbox.password,
        },
        production: {
          base_url: config.production.base_url,
          username: config.production.username,
          password: config.production.password,
        }
      };

      this.initializeAxios();
    } catch (error) {
      this.logger.error('Failed to initialize Facturama config:', error);
      throw error;
    }
  }

  private initializeAxios() {
    const currentConfig = this.config.is_development ? this.config.sandbox : this.config.production;
    const auth = Buffer.from(`${currentConfig.username}:${currentConfig.password}`).toString('base64');

    this.axiosInstance = axios.create({
      baseURL: currentConfig.base_url,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async createCustomer(customer: FacturamaCustomer): Promise<FacturamaCustomer> {
    try {
      const response = await this.axiosInstance.post('/api/Client', customer);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create Facturama customer:', error.response?.data || error.message);
      throw error;
    }
  }

  async createCFDI(cfdi: FacturaCFDI): Promise<FacturamaResponse> {
    try {
      const response = await this.axiosInstance.post('/api/3/cfdis', cfdi);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to create CFDI:', error.response?.data || error.message);
      throw error;
    }
  }

  async cancelCFDI(id: string, motive: string): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(`/api/3/cfdis/${id}?motive=${motive}&type=issued`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to cancel CFDI:', error.response?.data || error.message);
      throw error;
    }
  }

  async downloadPDF(id: string): Promise<Buffer> {
    try {
      const response = await this.axiosInstance.get(`/api/3/cfdis/${id}/pdf`, {
        responseType: 'arraybuffer'
      });
      return response.data;
    } catch (error) {
      this.logger.error('Failed to download PDF:', error.response?.data || error.message);
      throw error;
    }
  }

  async downloadXML(id: string): Promise<Buffer> {
    try {
      const response = await this.axiosInstance.get(`/api/3/cfdis/${id}/xml`, {
        responseType: 'arraybuffer'
      });
      return response.data;
    } catch (error) {
      this.logger.error('Failed to download XML:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateConfig(config: Partial<FacturamaConfig>): Promise<void> {
    try {
      await this.billConfigModel.updateOne(
        { is_active: true },
        { $set: config },
        { upsert: true }
      );
      await this.initializeConfig();
    } catch (error) {
      this.logger.error('Failed to update Facturama config:', error);
      throw error;
    }
  }

  async getConfig(): Promise<FacturamaConfig> {
    return this.config;
  }

  async validateRFC(rfc: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get(`/api/clients/rfc/${rfc}`);
      return response.status === 200;
    } catch (error) {
      if (error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  async getCFDIStatus(id: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/api/3/cfdis/${id}`);
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get CFDI status:', error.response?.data || error.message);
      throw error;
    }
  }
}
