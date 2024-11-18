export enum ShippingCarrierEnum {
  DHL = 'DHL',
  FEDEX = 'FEDEX',
  REDPACK = 'REDPACK',
  NOVENTA9MINUTOS = 'NOVENTA9MINUTOS',
  UPS = 'UPS',
  SENDEX = 'SENDEX',
}

export enum ShippingStatusEnum {
  PENDING = 'PENDING',
  QUOTED = 'QUOTED',
  LABELED = 'LABELED',
  PICKED_UP = 'PICKED_UP',
  ON_TRACK = 'ON_TRACK',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export enum ShippingModuleEnum {
  ORDERS = 'ORDERS',
  OTHER = 'OTHER',
}

export enum ShippingTypeEnum {
  ENVELOPE = 'ENVELOPE',
  BOX = 'BOX',
  PALLET = 'PALLET',
}

export enum ShippingRangeEnum {
  LOCAL = 'LOCAL',
  NACIONAL = 'NACIONAL',
}
