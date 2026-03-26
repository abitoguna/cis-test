import { Carrier } from "./Carrier"

export class CarrierRegistry {
  private carriers = new Map<string, Carrier>()

  register(name: string, carrier: Carrier) {
    this.carriers.set(name, carrier)
  }

  get(name: string): Carrier {
    const carrier = this.carriers.get(name)

    if (!carrier) {
      throw new Error(`Carrier ${name} not registered`)
    }

    return carrier
  }
}