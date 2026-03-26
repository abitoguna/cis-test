export interface RateQuote {
  carrier: string
  serviceLevel: string
  totalPrice: number
  currency: string
  estimatedDeliveryDays?: number
}

export class RateQuoteValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateQuoteValidationError';
  }
}

export const validateRateQuote = (quote: RateQuote): void => {
  if (!quote.carrier?.trim()) {
    throw new RateQuoteValidationError('Carrier name is required');
  }
  if (!quote.serviceLevel?.trim()) {
    throw new RateQuoteValidationError('Service level is required');
  }
  if (quote.totalPrice < 0) {
    throw new RateQuoteValidationError('Total price cannot be negative');
  }
  if (!quote.currency?.trim()) {
    throw new RateQuoteValidationError('Currency is required');
  }
};
