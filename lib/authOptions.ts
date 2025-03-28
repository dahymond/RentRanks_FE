import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { JWT } from "next-auth/jwt";

// Backend API URL
const DJANGO_API_URL =
  process.env.DJANGO_API_URL || "http://127.0.0.1:8000/api";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    // maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // console.log("OAuth Response:", token, account, profile)

      if (account && profile) {
        // Determine provider-specific fields
        const userData = {
          provider: account?.provider, // Dynamically set provider
          email: profile?.email,
          name: profile?.name,
          access_token: account?.access_token,
          picture: token?.picture,
          google_id: account.provider === "google" ? profile.sub : "",
          // facebook_id: account.provider === "facebook" ? profile.id : "",
        };

        // Send user data to Django
        try {
          const response = await fetch(`${DJANGO_API_URL}/auth/social-login/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
          });

          // if (!response.ok) throw new Error("Authentication failed");
          
          const data = await response.json();
          // console.log("django's response:", data);

          token.user_id = String(data.user_id); // Store Django user ID
          token.djangoJwt = data.access_token; // Store Django JWT
          token.jwtExpiry = data.exp; // Store expiration timestamp from Django
          token.provider = account?.provider;
        } catch (error: any) {
          console.log("error message:", error?.message);
        }
      }

      // django's jwt refresh
      if (token.djangoJwt && token.jwtExpiry) {
        const expiryTime = Number(token.jwtExpiry) * 1000;
        const currentTime = Date.now();
        const bufferTime = 5 * 60 * 1000; // 5 minutes before expiration

        if (currentTime >= expiryTime - bufferTime) {
          console.log("Refreshing JWT...");

          try {
            const refreshResponse = await fetch(
              `${DJANGO_API_URL}/auth/refresh-token/`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token.djangoJwt}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!refreshResponse.ok) throw new Error("Token refresh failed");

            const refreshData = await refreshResponse.json();
            token.djangoJwt = refreshData.access_token;
            token.jwtExpiry = refreshData.exp;
          } catch (refreshError: any) {
            console.log("Token refresh error:", refreshError.message);
          }
        }
      }

      // console.log("JWT callback token:", token);
      return token;
    },

    async session({ session, token }) {
      // console.log("Session callback received token:", token);
      const { user_id, djangoJwt, jwtExpiry, provider } = token as JWT;

      if (session.user) {
        session.user = {
          ...session.user,
          user_id: user_id,
          djangoJwt: djangoJwt,
          jwtExpiry: jwtExpiry,
          provider: provider,
        };
      } else {
        console.warn("Invalid user ID in token:", token.user_id);
      }
      return session;
    },
  },
  // cookies: {
  //   sessionToken: {
  //     name: `next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       secure: process.env.NODE_ENV === "production",
  //       sameSite: "lax",
  //       path: "/",
  //     },
  //   },
  // },
  secret: process.env.NEXTAUTH_SECRET,
  //   debug: process.env.NODE_ENV === "development",
};
