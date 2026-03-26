import { RateRequest } from "../../domain/models/RateRequest"
import { RateQuote } from "../../domain/models/RateQuote"

export class UPSRateMapper {

  static toUPSRequest(request: RateRequest) {
    return {
      shipment: {
        shipper: request.origin,
        recipient: request.destination,
        packages: request.packages,
      },
    }
  }

  static fromUPSResponse(response: any): RateQuote[] {
    return response.rates.map((rate: any) => ({
      carrier: "UPS",
      serviceLevel: rate.service,
      totalPrice: parseFloat(rate.price),
      currency: rate.currency,
    }))
  }

}