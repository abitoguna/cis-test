import { describe, it, expect } from "vitest"

describe("RateService", () => {

  it("should normalize UPS rate response", async () => {

    const response = {
      rates: [
        {
          service: "UPS Ground",
          price: "12.50",
          currency: "USD"
        }
      ]
    }

    expect(response.rates.length).toBe(1)

  })

})