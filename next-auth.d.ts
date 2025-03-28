import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      user_id: string;
      email: string;
      accessToken: string;
      djangoJwt: string;
      jwtExpiry: string;
      provider?: string;
    } & DefaultSession["user"];
  }

  interface User {
    name: string;
    user_id: string;
    email: string;
    image: string;
    djangoJwt: string;
    jwtExpiry: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id: string;
    djangoJwt: string;
    jwtExpiry: string;
    provider?: string;
    access_token?: string;
  }
}
