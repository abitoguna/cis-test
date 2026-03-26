interface CachedToken {
  token: string
  expiresAt: number
}

export class TokenCache {
  private cache?: CachedToken

  getToken(): string | null {
    if (!this.cache) return null

    if (Date.now() >= this.cache.expiresAt) {
      return null
    }

    return this.cache.token
  }

  setToken(token: string, expiresIn: number) {
    this.cache = {
      token,
      expiresAt: Date.now() + expiresIn * 1000,
    }
  }
}