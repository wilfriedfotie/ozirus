import NextAuth from "next-auth"
import { authConfig } from "./auth.config" // I need to split the config to avoid issues with edge runtime if needed, but let's stick to simple first

export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/admin/:path*"],
}