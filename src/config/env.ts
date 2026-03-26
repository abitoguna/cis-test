import dotenv from "dotenv"

dotenv.config()

export const env = {
  UPS_CLIENT_ID: process.env.UPS_CLIENT_ID!,
  UPS_CLIENT_SECRET: process.env.UPS_CLIENT_SECRET!,
  UPS_BASE_URL: process.env.UPS_BASE_URL!,
  UPS_AUTH_URL: process.env.UPS_AUTH_URL!
}