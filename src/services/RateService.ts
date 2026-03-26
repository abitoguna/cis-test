import { CarrierRegistry } from "../carriers/CarrierRegistry"
import { RateRequest } from "../domain/models/RateRequest"
import { RateQuote } from "../domain/models/RateQuote"

export class RateService {

  constructor(private registry: CarrierRegistry) {}

  async getRates(request: RateRequest): Promise<RateQuote[]> {

    const ups = this.registry.get("ups")

    return ups.getRates(request)

  }

}