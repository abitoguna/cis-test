export class CarrierError extends Error {
  constructor(
    public code: string,
    message: string,
    public carrier?: string,
    public details?: unknown
  ) {
    super(message)
  }
}