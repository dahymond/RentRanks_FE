import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

// Backend API URL
const DJANGO_API_URL =
  // process.env.DJANGO_API_URL || "http://127.0.0.1:8000/api";
  "https://rentranks-be.onrender.com/api";

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
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide credentials");
        }

        try {
          const response = await fetch(
            `${process.env.DJANGO_API_URL}/auth/login/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            }
          );

          if (!response.ok) {
            console.error(
              "Invalid login attempt:",
              response.status,
              response.statusText
            );
            return null; // Prevents authentication from proceeding
          }

          const data = await response.json();

          if (!data.access_token) {
            console.error("Invalid response from Django:", data);
            return null;
          }

          return {
            user_id: String(data.user_id),
            email: credentials?.email,
            djangoJwt: data.access_token,
            jwtExpiry: data.exp,
          };
        } catch (error: any) {
          console.error("Credentials Auth Error:", error?.message);
          return null; // Return null to indicate authentication failure
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account, profile, user }) {
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

        const response = await fetch(`${DJANGO_API_URL}/auth/social-login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          // console.log(response)
          throw new Error("Authentication failed");
        }

        // if (!response.ok) {
        //   // console.error("Social login failed:", await response.json());
        //   return {user_id: null, djangoJwt: null, jwtExpiry: null, provider: null }; // ✅ Proper return structure
        // }

        const data = await response.json();

        // console.log("django's response:", data);

        token.user_id = String(data.user_id); // Store Django user ID
        token.djangoJwt = data.access_token; // Store Django JWT
        token.jwtExpiry = data.exp; // Store expiration timestamp from Django
        token.provider = account?.provider;
        // } catch (error: any) {
        //   console.log("error message:", error?.message, error);
        //   return {user_id: null, djangoJwt: null, jwtExpiry: null, provider: null }; // ✅ Proper return structure
        //   // return token
        // }
      }

      // Handle Credentials Authentication
      if (account?.provider === "credentials" && user) {
        token.user_id = String(user.user_id);
        token.email = String(user.email);
        token.djangoJwt = user.djangoJwt;
        token.jwtExpiry = user.jwtExpiry;
        token.provider = "credentials";
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

            if (!refreshResponse.ok) {
              console.error(
                "Token refresh failed:",
                refreshResponse.statusText
              );
              return {
                ...token,
                user_id: null,
                djangoJwt: null,
                jwtExpiry: null,
                provider: null,
              }; // ✅ Proper return structure
              // return token
            }

            const refreshData = await refreshResponse.json();
            token.djangoJwt = refreshData.access_token;
            token.jwtExpiry = refreshData.exp;
          } catch (refreshError: any) {
            console.log("Token refresh error:", refreshError.message);
            return {
              ...token,
              user_id: null,
              djangoJwt: null,
              jwtExpiry: null,
              provider: null,
            }; // ✅ Proper return structure Prevent storing an expired token
            // return null
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      // console.log(
      //   "line 179: A log of session value",
      //   session,
      //   "token vaule:",
      //   token
      // );
      const { user_id, djangoJwt, jwtExpiry, provider } = token as JWT;

      if (session.user.email) {
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
  secret: process.env.NEXTAUTH_SECRET,
};
