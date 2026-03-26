/**
 * UPS-specific types and interfaces
 */
export interface UPSAddress {
  AddressLine?: string;
  City?: string;
  StateProvinceCode?: string;
  PostalCode?: string;
  CountryCode?: string;
  CompanyName?: string;
  AttentionName?: string;
  PhoneNumber?: string;
  EmailAddress?: string;
}

export interface UPSPackage {
  PackageWeight: {
    UnitOfMeasurement: {
      Code: string;
      Description?: string;
    };
    Weight: string;
  };
  Dimensions?: {
    UnitOfMeasurement: {
      Code: string;
      Description?: string;
    };
    Length: string;
    Width: string;
    Height: string;
  };
  PackageType?: {
    Code: string;
  };
  Description?: string;
  PackageServiceOptions?: {
    DeliveryConfirmation?: {
      DCISType: string;
    };
  };
}

export interface UPSRateRequest {
  RateRequest: {
    Request: {
      RequestOption: string;
      SubVersion?: string;
    };
    PickupType: {
      Code: string;
    };
    CustomerClassification?: {
      Code: string;
    };
    Shipment: {
      Shipper: {
        Address: UPSAddress;
        ShipperNumber: string;
      };
      ShipTo: {
        Address: UPSAddress;
        CompanyName: string;
      };
      ShipFrom?: {
        Address: UPSAddress;
        CompanyName: string;
      };
      Package: UPSPackage[];
      Service?: {
        Code: string;
      };
      InvoiceLineTotal?: string;
      NumOfPieces?: string;
      Description?: string;
    };
  };
}

export interface UPSRateResponse {
  RateResponse: {
    Response: {
      ResponseStatus: {
        Code: string;
        Description: string;
      };
      Alert?: Array<{
        Code: string;
        Description: string;
      }>;
    };
    RatedShipment?: Array<{
      Service: {
        Code: string;
        Description: string;
      };
      RatedPackage?: Array<{
        BaseServiceCharge: {
          CurrencyCode: string;
        };
        ServiceOptionsCharges?: {
          CurrencyCode: string;
        };
        TransportationCharges?: {
          CurrencyCode: string;
        };
        Surcharges?: Array<{
          SurchargeType: string;
          Money: {
            CurrencyCode: string;
          };
        }>;
        TotalCharges: {
          CurrencyCode: string;
        };
      }>;
      TotalCharges: {
        CurrencyCode: string;
      };
      GuaranteedDaysToDelivery?: string;
      ScheduledDeliveryTime?: string;
    }>;
  };
}

export interface UPSAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface UPSAuthError {
  error: string;
  error_description: string;
}
