import { HttpClient } from "../../infrastructure/http/HttpClient"
import { UPSAuthService } from "./UPSAuthService"

export class UPSClient {
  constructor(
    private http: HttpClient,
    private auth: UPSAuthService,
    private baseUrl: string
  ) {}

  async getRates(payload: unknown) {
    const token = await this.auth.getToken()

    return this.http.post(
      `${this.baseUrl}/rating`,
      payload,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    )
  }
}