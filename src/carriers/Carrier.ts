import { RateRequest } from "../domain/models/RateRequest"
import { RateQuote } from "../domain/models/RateQuote"

export interface Carrier {
  getRates(request: RateRequest): Promise<RateQuote[]>
}