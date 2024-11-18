export enum PaymentSourceEnum {
  CASH = 'CASH', // Pagos en efectivo
  OP_CARD = 'OP_CARD', // Pagos con Optenpay tarjeta
  OP_SPEI = 'OP_SPEI', // Pagos con Optenpay spei
  OP_STORE = 'OP_STORE', // Pagos con Optenpay paynet
  MP_GENERAL = 'MP_GENERAL', // Pagos con Mercado Pago
  DIRECT_TRANSFER = 'DIRECT_TRANSFER', // Pagos  transeferencias bancarias
}

export enum PaymentStatusEnum {
  PENDING = 'PENDING', // Pendiente de pago
  PAYED = 'PAYED', // Pagado
  CANCELLED = 'CANCELLED', // Cuando lo cancela Mercado pago, o Openpay
  REJECTED = 'REJECTED', // Cuando lo cancela el usuario o Administrador
  REFUNDED = 'REFUNDED', // Cuando Se regresa el dinero
  IN_REVIEW = 'IN_REVIEW', // Cuando es pago manual o transferencia directa y esta en proceso de revision
  ACCEPTED = 'ACCEPTED', // Cuando es pago manual o transferencia directa  y se acepto
}

export enum PaymentModuleEnum {
  ORDERS = 'ORDERS',
  OTHER = 'OTHER',
}
