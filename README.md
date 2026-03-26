# Cybership Carrier Integration Service

A production-grade TypeScript backend service that abstracts shipping carrier APIs through a unified interface. Currently integrated with UPS Rating API, with extensibility for future carriers (FedEx, DHL, etc.).

**Tech Stack**: Next.js (API Routes), TypeScript, Vitest, Node.js 18+

### Running

Install dependencies

npm install

Run tests

npm run test

Run dev server

npm run dev

---

## 1. Project Overview

This project implements a **carrier-agnostic rate quotation service** that solves the problem of integrating multiple shipping carriers into a single application. Rather than exposing carrier-specific APIs directly to clients, this service provides:

- **Unified API Contract**: Single endpoint (`POST /api/rates`) returns consistent rate quotes regardless of carrier
- **Abstraction Layer**: Carriers are interchangeable implementations behind a common interface
- **OAuth Token Management**: Automated token lifecycle handling for authentication
- **Type Safety**: Full TypeScript implementation with domain models and validation
- **Error Transparency**: Structured error responses with carrier context and recovery hints

**Primary Use Case**: E-commerce or logistics platforms that need real-time shipping rates from multiple carriers with minimal integration friction.

### Key Capabilities

- ✅ Get real-time shipping quotes from UPS API
- ✅ Automatic OAuth token caching & refresh
- ✅ Multi-layer input validation (API, domain, carrier)
- ✅ Request/response transformation between domain and carrier formats
- ✅ Comprehensive error handling with typed errors
- ✅ Extensible carrier abstraction for adding new integrations
- ✅ Aggregation support (query multiple carriers in parallel)

---

## 2. Architecture Overview

The system follows a **layered architecture** with clear separation of concerns, from the HTTP request entry point through to carrier integration.

### Request Flow Diagram

```
POST /api/rates
    ↓
route.ts [API Layer]
    ├─ Dependency Injection
    ├─ Validates JSON payload
    └─ Delegates to RateService
        ↓
RateService [Business Logic]
    ├─ Calls rateRequestSchema.validate()
    └─ Delegates to CarrierRegistry.getRates()
        ↓
CarrierRegistry [Registry Pattern]
    └─ Lookup: self.carriers.get(carrierName)
        ↓
UPSCarrier [Adapter Pattern]
    ├─ buildUPSRateRequest() — domain → UPS format
    ├─ Delegates to upsClient.getRates()
    │   ↓
    │   UPSClient [API Client]
    │   ├─ Calls authService.getAccessToken()
    │   │   ├─ tokenCache.get() → fast-path
    │   │   └─ If miss/expired: authService.requestNewToken()
    │   │       └─ POST /oauth/token with Basic Auth
    │   └─ POST /rating with Bearer token
    │       ↓ (UPS API returns RateResponse)
    │
    └─ UPSRateMapper.mapToRateQuotes() — UPS → domain format
        ↓
NextResponse.json(RateQuote[])
```

### Component Responsibilities

| Component | Responsibility | Location |
|-----------|---|---|
| **route.ts** | HTTP handling, dependency injection, error serialization | `src/app/api/rates/route.ts` |
| **RateService** | Business logic orchestration, validation, carrier delegation | `src/services/RateService.ts` |
| **CarrierRegistry** | Carrier lifecycle management, discovery | `src/carriers/CarrierRegistry.ts` |
| **Carrier (Interface)** | Contract for carrier implementations | `src/carriers/Carrier.ts` |
| **UPSCarrier** | UPS-specific implementation, format translation | `src/carriers/ups/UPSCarrier.ts` |
| **UPSClient** | UPS API communication, low-level HTTP logic | `src/carriers/ups/UPSClient.ts` |
| **UPSAuthService** | OAuth 2.0 token lifecycle management | `src/carriers/ups/UPSAuthService.ts` |
| **UPSRateMapper** | Bidirectional transformation (domain ↔ UPS format) | `src/carriers/ups/UPSRateMapper.ts` |
| **HttpClient** | Generic HTTP client with retry logic | `src/infrastructure/http/HttpClient.ts` |
| **TokenCache** | In-memory token storage with TTL-based expiry | `src/infrastructure/cache/TokenCache.ts` |

---

## 3. Project Structure

```
cybership-carrier-integration/
│
├── src/
│   ├── app/api/rates/
│   │   └── route.ts                 # Next.js API route (POST/GET)
│   │
│   ├── config/
│   │   └── env.ts                   # Environment loading & validation
│   │
│   ├── domain/
│   │   ├── models/
│   │   │   ├── Address.ts           # Address model + validation
│   │   │   ├── Package.ts           # Package model + validation
│   │   │   ├── RateRequest.ts       # Rate query model + validation
│   │   │   └── RateQuote.ts         # Rate response model + validation
│   │   │
│   │   └── errors/
│   │       └── CarrierError.ts      # Error hierarchy & custom exceptions
│   │
│   ├── carriers/
│   │   ├── Carrier.ts               # Base interface for all carriers
│   │   ├── CarrierRegistry.ts       # Registry for carrier discovery
│   │   │
│   │   └── ups/                     # UPS integration
│   │       ├── UPSCarrier.ts        # UPS implementation of Carrier
│   │       ├── UPSClient.ts         # UPS API client
│   │       ├── UPSAuthService.ts    # OAuth token management
│   │       ├── UPSRateMapper.ts     # Domain ↔ UPS format translation
│   │       └── types.ts             # UPS TypeScript interfaces
│   │
│   ├── infrastructure/
│   │   ├── http/
│   │   │   └── HttpClient.ts        # HTTP client with retry logic
│   │   │
│   │   └── cache/
│   │       └── TokenCache.ts        # Token storage with TTL expiry
│   │
│   ├── services/
│   │   └── RateService.ts           # Rate service business logic
│   │
│   ├── validation/
│   │   └── schemas.ts               # Validation schemas & helpers
│   │
│   └── tests/
│       ├── integration/
│       │   ├── rateService.test.ts  # Service integration tests
│       │   ├── upsAuth.test.ts      # OAuth token tests
│       │   └── errorHandling.test.ts # Error handling tests
│       │
│       └── fixtures/
│           ├── upsTokenResponse.json     # Mock OAuth response
│           ├── upsRateResponse.json      # Mock rate quote response
│           └── upsErrorResponse.json     # Mock error response
│
├── .env.example                      # Environment variable template
├── .env.local                        # Local environment (git-ignored)
├── package.json                      # Dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
├── vitest.config.ts                  # Test runner configuration
├── next.config.ts                    # Next.js configuration
└── README.md                         # This file
```

---

## 4. Domain Models

The domain models represent the core business entities independent of any carrier or HTTP implementation.

### Address

Represents a shipping location (origin or destination).

```typescript
interface Address {
  street: string;              // Required
  city: string;                // Required
  state: string;               // State/province code
  postalCode: string;           // ZIP/postal code
  country: string;              // ISO country code
}
```

**Validation**: All required fields must be non-empty strings. Throws `AddressValidationError` on failure.

### Package

Represents a single item in a shipment.

```typescript
interface Package {
   weight: number;
  length: number;
  width: number;
  height: number;
  unit: "metric" | "imperial"; 
}
```

**Validation**: Weight > 0, valid units, dimensions > 0 if provided. Throws `PackageValidationError` on failure.

### RateRequest

Represents a shipping quote query.

```typescript
interface RateRequest {
  origin: Address
  destination: Address
  packages: Package[]
  serviceLevel?: string
}
```

**Validation**: Addresses and packages must be valid. Returns `{ valid: boolean, errors: string[] }`.

### RateQuote

Represents a shipping rate response from a carrier.

```typescript
interface RateQuote {
  carrier: string;           // E.g., "UPS"
  serviceLevel: string;           // E.g., "UPS Ground"
  currency: string;              // E.g., "USD"
  totalPrice: number
  estimatedDeliveryDays?: number;   
}
```

---

## 5. Carrier Abstraction Design

The carrier abstraction enables **polymorphic behavior** and **future-proof extensibility**.

### Carrier Interface

```typescript
interface ICarrier {
  name: string;
  isAvailable(): Promise<boolean>;
  getRates(request: RateRequest): Promise<RateQuote[]>;
}
```

### Design Patterns

**Registry Pattern** (`CarrierRegistry`):
- Maintains `Map<string, ICarrier>` of available carriers
- Runtime discovery: `registry.getCarrier("ups")`
- Supports multi-carrier queries: `registry.getAllRates(request)`

**Adapter Pattern** (`UPSCarrier`):
- Converts domain `RateRequest` to UPS-specific format
- Converts UPS response back to domain `RateQuote[]`
- Hides UPS API complexity

**Mapper Pattern** (`UPSRateMapper`):
- Separates transformation logic from carrier class
- Testable in isolation
- Supports bidirectional: domain ↔ UPS

---

## 6. UPS Integration and OAuth Token Lifecycle

### OAuth Flow

```
UPSClient.getRates()
    ├─ Call UPSAuthService.getAccessToken()
    │   ├─ Check TokenCache.get("ups_access_token")
    │   ├─ If fresh: return cached token
    │   ├─ If miss/expired:
    │   │   └─ POST /security/v1/oauth/token
    │   │       ├─ Headers: Authorization: Basic <base64(id:secret)>
    │   │       ├─ Body: grant_type=client_credentials
    │   │       └─ Extract access_token + expires_in
    │   └─ Cache token with expiry, return
    │
    └─ POST /rating/v1/Shop/Confirmation
        Headers: Authorization: Bearer <token>
        Body: rate request
```

### Token Cache Strategy

- **Fast-path**: Check cache first (no API call)
- **Expiry Buffer**: Subtract 5 minutes from TTL to prevent mid-request expiry
- **In-memory Storage**: Suitable for single-instance deployments
- **Production**: Use Redis for multi-instance setups

---

## 7. Input Validation Strategy

Validation at **three layers**:

1. **API Input**: Fast JSON/type checks via `schemas.ts`
2. **Domain Models**: Business logic constraints via `validate*()` functions
3. **Carrier-specific**: Implicit in mapping logic

---

## 8. Error Handling Strategy

**Error Hierarchy**:
```
CarrierError (base)
├── CarrierNotFoundError (404)
├── CarrierServiceError (503)
├── RateQuoteError (400)
├── AuthenticationError (401)
└── ValidationError (400)
```

**Properties**: `message`, `code`, `statusCode`, `details: Record<string, any>`

Example error response:
```json
{
  "success": false,
  "error": "Invalid rate request",
  "code": "VALIDATION_ERROR",
  "details": { "errors": [...] },
  "statusCode": 400
}
```

---

## 9. Integration Testing Approach

Tests validate **behavior** using **fixtures** for consistency.

**Test Categories**:
- **rateService.test.ts**: Service orchestration & validation
- **upsAuth.test.ts**: Token caching lifecycle
- **errorHandling.test.ts**: Error hierarchy & properties

**Fixtures**:
- `upsTokenResponse.json`: Mock OAuth token
- `upsRateResponse.json`: Mock rate quotes
- `upsErrorResponse.json`: Mock error response

**Framework**: Vitest

---

## 10. Running the Project

### Prerequisites
- Node.js 18.17.0+
- npm 9.0.0+
- UPS Developer Account (free tier available)

### Setup

```bash
# Clone and install
git clone <repo>
cd cybership-carrier-integration
npm install

# Configure environment
cp .env.example .env.local
nano .env.local  # Add your UPS credentials

# Build
npm run build

# Development
npm run dev      # http://localhost:3000

# Test
npm run test              # Run once
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Project Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run tests |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | Coverage report |

---

## 11. Environment Variables

| Variable | Required | Description |
|----------|----------|---|
| **NODE_ENV** | No | `development` or `production` |
| **UPS_CLIENT_ID** | ✅ Yes | OAuth client ID |
| **UPS_CLIENT_SECRET** | ✅ Yes | OAuth client secret |
| **UPS_SHIPPER_NUMBER** | ✅ Yes | Your UPS shipper account number |
| **UPS_BASE_URL** | No | API base URL (defaults to production) |
| **UPS_AUTH_URL** | No | OAuth endpoint |
| **LOG_LEVEL** | No | `info`, `debug`, or `error` |

### Getting UPS Credentials

1. Register at https://developer.ups.com/
2. Create OAuth app (Client Credentials grant)
3. Get Shipper Number from account settings
4. Enable Rating API in API Catalog

---

## 12. Example API Request and Response

### Request

```bash
curl -X POST http://localhost:3000/api/rates \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "street": "100 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "postalCode": "90001",
      "country": "US"
    },
    "destination": {
      "street": "456 Oak Ave",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US"
    },
    "packages": [
      {
        "weight": 5.5,
        "weightUnit": "LB",
        "dimensions": {
          "length": 12,
          "width": 8,
          "height": 6,
          "unit": "IN"
        }
      }
    ]
  }'
```

### Success Response (200 OK)

```json
{
  "success": true,
  "rates": [
    {
      "carrierName": "UPS",
      "serviceType": "UPS Next Day Air",
      "baseRate": 42.50,
      "currency": "USD",
      "surcharges": [
        {
          "type": "SR",
          "amount": 1.50,
          "description": "Surcharge"
        }
      ],
      "totalRate": 52.25,
      "estimatedDelivery": {
        "businessDays": 1
      },
      "guaranteedIndicator": true,
      "attributes": {
        "serviceCode": "13"
      }
    }
  ]
}
```

### Error Response (400)

```json
{
  "success": false,
  "error": "Invalid rate request",
  "code": "VALIDATION_ERROR",
  "details": {
    "errors": [
      "From address: Street is required"
    ]
  }
}
```

---

## 13. Extensibility

### Adding a New Carrier (e.g., FedEx)

1. **Create FedExCarrier** implementing `Carrier` interface
2. **Create FedExClient** for API communication
3. **Create FedExAuthService** (if needed)
4. **Create FedExRateMapper** for request/response transformation
5. **Register in route.ts**:
   ```typescript
   registry.register(new FedExCarrier(...));
   ```

That's it! Existing code automatically supports the new carrier.

---

## 14. Future Improvements

### Performance
- Distributed token cache (Redis)
- Rate quote caching with TTL
- Connection pooling & keep-alive
- Parallel carrier aggregation

### Reliability
- Exponential backoff retry logic
- Circuit breaker for failed carriers
- Request deduplication
- Fallback/cached rates

### Observability
- Structured logging (Winston/Pino)
- Distributed tracing (OpenTelemetry)
- Metrics (Prometheus)
- Error reporting (Sentry)

### Security
- Input sanitization
- Rate limiting (token bucket)
- TLS encryption
- Audit logging
- Secret rotation

### Scalability
- Horizontal scaling (load balancer)
- Database persistence
- Async job queue
- API gateway
- CDN caching

---

## License

MIT

## Support

For questions or issues, open a GitHub issue or contact engineering@cybership.dev