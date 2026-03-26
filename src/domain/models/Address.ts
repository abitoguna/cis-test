/**
 * Address model for shipping locations
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export class AddressValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AddressValidationError';
  }
}

export const validateAddress = (address: Address): void => {
  if (!address.street?.trim()) {
    throw new AddressValidationError('Street is required');
  }
  if (!address.city?.trim()) {
    throw new AddressValidationError('City is required');
  }
  if (!address.state?.trim()) {
    throw new AddressValidationError('State is required');
  }
  if (!address.postalCode?.trim()) {
    throw new AddressValidationError('Postal code is required');
  }
  if (!address.country?.trim()) {
    throw new AddressValidationError('Country is required');
  }
};
