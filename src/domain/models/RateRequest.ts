import { Address } from './Address';
import { Package } from './Package';

export interface RateRequest {
  origin: Address
  destination: Address
  packages: Package[]
  serviceLevel?: string
}

export class RateRequestValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateRequestValidationError';
  }
}

export const validateRateRequest = (request: RateRequest): void => {
  if (!request.origin) {
    throw new RateRequestValidationError('Origin address is required');
  }
  if (!request.destination) {
    throw new RateRequestValidationError('Destination address is required');
  }
  if (!request.packages || request.packages.length === 0) {
    throw new RateRequestValidationError('At least one package is required');
  }
};
