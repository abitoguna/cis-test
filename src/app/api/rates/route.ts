import { NextRequest, NextResponse } from "next/server"

import { CarrierRegistry } from "@/carriers/CarrierRegistry"
import { UPSCarrier } from "@/carriers/ups/UPSCarrier"
import { UPSClient } from "@/carriers/ups/UPSClient"
import { UPSAuthService } from "@/carriers/ups/UPSAuthService"

import { HttpClient } from "@/infrastructure/http/HttpClient"
import { TokenCache } from "@/infrastructure/cache/TokenCache"

import { RateService } from "@/services/RateService"

import { env } from "@/config/env"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const http = new HttpClient()
    const cache = new TokenCache()

    const auth = new UPSAuthService(
      http,
      cache,
      env.UPS_CLIENT_ID,
      env.UPS_CLIENT_SECRET,
      env.UPS_AUTH_URL
    )

    const upsClient = new UPSClient(http, auth, `${env.UPS_BASE_URL}/rating/v1/`)

    const upsCarrier = new UPSCarrier(upsClient)

    const registry = new CarrierRegistry()
    registry.register("ups", upsCarrier)

    const rateService = new RateService(registry)

    const rates = await rateService.getRates(body)

    return NextResponse.json(rates)

  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          message: error.message
        }
      },
      { status: 500 }
    )
  }
}