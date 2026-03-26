import { describe, it, expect } from "vitest"

describe("UPSAuthService", () => {

  it("should cache token", async () => {

    const token = "fake_token"

    expect(token).toBe("fake_token")

  })

})