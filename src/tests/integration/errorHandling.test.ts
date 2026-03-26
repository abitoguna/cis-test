import { describe, it, expect, vi } from "vitest"
import { UPSCarrier } from "../../carriers/ups/UPSCarrier"
import { UPSClient } from "../../carriers/ups/UPSClient"
import { CarrierError } from "../../domain/errors/CarrierError"

describe("Error Handling", () => {

  it("should throw structured error for 401 auth failure", async () => {

    const mockClient = {
      getRates: vi.fn().mockRejectedValue(
        new CarrierError(
          "AUTH_ERROR",
          "Authentication with UPS failed",
          "UPS"
        )
      )
    } as unknown as UPSClient

    const carrier = new UPSCarrier(mockClient)

    await expect(
      carrier.getRates({} as any)
    ).rejects.toThrow(CarrierError)

  })

  it("should handle network timeout", async () => {

    const mockClient = {
      getRates: vi.fn().mockRejectedValue(
        new CarrierError(
          "NETWORK_ERROR",
          "Network timeout",
          "UPS"
        )
      )
    } as unknown as UPSClient

    const carrier = new UPSCarrier(mockClient)

    await expect(
      carrier.getRates({} as any)
    ).rejects.toThrow("Network timeout")

  })

  it("should handle carrier API errors", async () => {

    const mockClient = {
      getRates: vi.fn().mockRejectedValue(
        new CarrierError(
          "CARRIER_API_ERROR",
          "UPS returned 500",
          "UPS"
        )
      )
    } as unknown as UPSClient

    const carrier = new UPSCarrier(mockClient)

    await expect(
      carrier.getRates({} as any)
    ).rejects.toThrow("UPS returned 500")

  })

})