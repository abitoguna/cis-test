export class HttpClient {
  async post(url: string, body: unknown, headers: Record<string, string>) {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }

    return res.json()
  }

  async get(url: string, headers: Record<string, string>) {
    const res = await fetch(url, { headers })

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }

    return res.json()
  }
}