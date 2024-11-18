export interface FacturamaConfig {
  is_development: boolean;
  sandbox: {
    base_url: string;
    username: string;
    password: string;
  };
  production: {
    base_url: string;
    username: string;
    password: string;
  };
}

export interface FacturamaCredentials {
  username: string;
  password: string;
}

export interface FacturamaCustomer {
  Id?: string;
  Email: string;
  Rfc: string;
  Name: string;
  FiscalRegime: string;
  TaxResidence?: string;
  CfdiUse: string;
  TaxZipCode: string;
  Address?: {
    Street: string;
    ExteriorNumber: string;
    InteriorNumber?: string;
    Neighborhood: string;
    ZipCode: string;
    Locality?: string;
    Municipality: string;
    State: string;
    Country: string;
  };
}

export interface FacturamaItem {
  ProductCode: string;
  IdentificationNumber: string;
  Description: string;
  Unit: string;
  UnitCode: string;
  UnitPrice: number;
  Quantity: number;
  Subtotal: number;
  TaxObject: string;
  Taxes: Array<{
    Total: number;
    Name: string;
    Base: number;
    Rate: number;
    IsRetention: boolean;
  }>;
  Total: number;
}

export interface FacturaCFDI {
  Serie: string;
  Currency: string;
  ExpeditionPlace: string;
  PaymentConditions?: string;
  Folio?: string;
  CfdiType: string;
  PaymentForm: string;
  PaymentMethod: string;
  Receiver: FacturamaCustomer;
  Items: FacturamaItem[];
}

export interface FacturamaResponse {
  Id: string;
  CfdiType: string;
  Serie: string;
  Folio: string;
  Date: string;
  CertNumber: string;
  PaymentTerms: string;
  PaymentConditions: string;
  PaymentMethod: string;
  PaymentForm: string;
  ExpeditionPlace: string;
  ExchangeRate: number;
  Currency: string;
  Subtotal: number;
  Discount?: number;
  Total: number;
  Issuer: {
    FiscalRegime: string;
    Rfc: string;
    TaxName: string;
  };
  Receiver: FacturamaCustomer;
  Items: FacturamaItem[];
  Taxes: Array<{
    Total: number;
    Name: string;
    Rate: number;
    Type: string;
  }>;
  Complement?: {
    TaxStamp: {
      Uuid: string;
      Date: string;
      CfdiSign: string;
      SatCertNumber: string;
      SatSign: string;
    };
  };
  Status: string;
  OriginalString: string;
  PdfUrl?: string;
  XmlUrl?: string;
}

export enum BillStatus {
  PENDING = 'pending',
  GENERATED = 'generated',
  CANCELLED = 'cancelled',
  ERROR = 'error'
}

export enum CFDIUseEnum {
  G01 = 'G01', // Adquisición de mercancías
  G02 = 'G02', // Devoluciones, descuentos o bonificaciones
  G03 = 'G03', // Gastos en general
  I01 = 'I01', // Construcciones
  I02 = 'I02', // Mobiliario y equipo de oficina
  I03 = 'I03', // Equipo de transporte
  I04 = 'I04', // Equipo de cómputo
  I05 = 'I05', // Dados, troqueles, moldes, matrices y herramental
  I06 = 'I06', // Comunicaciones telefónicas
  I07 = 'I07', // Comunicaciones satelitales
  I08 = 'I08', // Otra maquinaria y equipo
  D01 = 'D01', // Honorarios médicos, dentales y gastos hospitalarios
  D02 = 'D02', // Gastos médicos por incapacidad o discapacidad
  D03 = 'D03', // Gastos funerales
  D04 = 'D04', // Donativos
  D05 = 'D05', // Intereses reales efectivamente pagados por créditos hipotecarios
  D06 = 'D06', // Aportaciones voluntarias al SAR
  D07 = 'D07', // Primas por seguros de gastos médicos
  D08 = 'D08', // Gastos de transportación escolar obligatoria
  D09 = 'D09', // Depósitos en cuentas para el ahorro, primas de pensiones
  D10 = 'D10', // Pagos por servicios educativos (colegiaturas)
  P01 = 'P01', // Por definir
  S01 = 'S01', // Sin efectos fiscales
  CP01 = 'CP01' // Pagos
}

export enum PaymentFormEnum {
  EFECTIVO = '01',
  CHEQUE_NOMINATIVO = '02',
  TRANSFERENCIA_ELECTRONICA = '03',
  TARJETA_CREDITO = '04',
  MONEDERO_ELECTRONICO = '05',
  DINERO_ELECTRONICO = '06',
  VALES_DESPENSA = '08',
  DACION_EN_PAGO = '12',
  PAGO_POR_SUBROGACION = '13',
  PAGO_POR_CONSIGNACION = '14',
  CONDONACION = '15',
  COMPENSACION = '17',
  NOVACION = '23',
  CONFUSION = '24',
  REMISION_DE_DEUDA = '25',
  PRESCRIPCION_O_CADUCIDAD = '26',
  A_SATISFACCION_DEL_ACREEDOR = '27',
  TARJETA_DE_DEBITO = '28',
  TARJETA_DE_SERVICIOS = '29',
  APLICACION_DE_ANTICIPOS = '30',
  POR_DEFINIR = '99'
}

export enum PaymentMethodEnum {
  PUE = 'PUE', // Pago en una sola exhibición
  PPD = 'PPD'  // Pago en parcialidades o diferido
}

export enum FiscalRegimeEnum {
  GENERAL = '601', // General de Ley Personas Morales
  PERSONAS_MORALES = '603', // Personas Morales con Fines no Lucrativos
  PERSONAS_FISICAS = '605', // Sueldos y Salarios e Ingresos Asimilados a Salarios
  ARRENDAMIENTO = '606', // Arrendamiento
  RIF = '621', // Régimen de Incorporación Fiscal
  ACTIVIDADES_AGRICOLAS = '622', // Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras
  OPCIONAL = '623', // Opcional para Grupos de Sociedades
  COORDINADOS = '624', // Coordinados
  HIDROCARBUROS = '628' // Hidrocarburos
}
