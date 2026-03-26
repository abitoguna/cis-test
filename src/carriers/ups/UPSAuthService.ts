import { HttpClient } from "../../infrastructure/http/HttpClient"
import { TokenCache } from "../../infrastructure/cache/TokenCache"

export class UPSAuthService {
  constructor(
    private http: HttpClient,
    private cache: TokenCache,
    private clientId: string,
    private clientSecret: string,
    private authUrl: string
  ) {}

  async getToken(): Promise<string> {
    const cached = this.cache.getToken()

    if (cached) {
      return cached
    }

    const response = await this.http.post(
      this.authUrl,
      {
        grant_type: "client_credentials",
      },
      {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${this.clientId}:${this.clientSecret}`
        ).toString("base64")}`,
      }
    )

    this.cache.setToken(response.access_token, response.expires_in)

    return response.access_token
  }
}