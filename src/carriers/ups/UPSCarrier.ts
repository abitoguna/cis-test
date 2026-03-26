import { Carrier } from "../Carrier"
import { RateRequest } from "../../domain/models/RateRequest"
import { RateQuote } from "../../domain/models/RateQuote"
import { UPSClient } from "./UPSClient"
import { UPSRateMapper } from "./UPSRateMapper"

export class UPSCarrier implements Carrier {

  constructor(private client: UPSClient) {}

  async getRates(request: RateRequest): Promise<RateQuote[]> {

    const payload = UPSRateMapper.toUPSRequest(request)

    const response = await this.client.getRates(payload)

    return UPSRateMapper.fromUPSResponse(response)
  }

}