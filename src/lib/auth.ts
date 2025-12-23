import { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { publicApi } from "./api/axios";

declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
  }
  interface Session {
    user: {
      id?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const OAUTH_PROVIDERS = ["google", "github", "facebook"];

function isOAuthAccountValid(
  provider: string,
  profile: any,
  user: any
): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user?.email || !emailRegex.test(user.email) || !user?.name) return false;
  switch (provider) {
    case "google":
      return (
        !!profile?.email_verified && !profile?.suspended && !profile?.disabled
      );
    case "github":
      return (
        !profile?.suspended_at &&
        profile?.type === "User" &&
        !!profile?.email
      );
    case "facebook":
      return (
        !!profile?.email &&
        !profile?.is_silhouette
      );
    default:
      return true;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "email public_profile",
        },
      },
    }),

    // Credentials Provider (existing email/password login)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          const result = await response.json();

          if (response.ok && result.success && result.data) {
            return {
              id: result.data.id,
              email: result.data.email,
              name: `${result.data.firstName} ${result.data.lastName}`,
              role: result.data.role,
              image: result.data.avatar,
            };
          }

          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account && OAUTH_PROVIDERS.includes(account.provider)) {
        try {
          if (!isOAuthAccountValid(account.provider, profile, user)) {
            return `/auth/error?error=AccountNotEligible`;
          }

          let existingUser = null;
          try {
            const response = await publicApi.get(`/users?email=${encodeURIComponent(user.email!)}`);
            
            const users = Array.isArray(response) 
              ? response 
              : (response?.data || response);
            
            if (users && Array.isArray(users) && users.length > 0) {
              existingUser = users[0];
            } else {
              existingUser = null;
            }
          } catch (error) {
            existingUser = null;
          }

          if (!existingUser) {
            try {
              const doubleCheckResponse = await publicApi.get(`/users?email=${encodeURIComponent(user.email!)}`);
              
              const doubleCheckUsers = Array.isArray(doubleCheckResponse) 
                ? doubleCheckResponse 
                : (doubleCheckResponse?.data || doubleCheckResponse);
              
              if (doubleCheckUsers && Array.isArray(doubleCheckUsers) && doubleCheckUsers.length > 0) {
                existingUser = doubleCheckUsers[0];
              } else {
                const newUser = {
                  email: user.email,
                  password: null,
                  firstName: user.name?.split(" ")[0] || "OAuth",
                  lastName: user.name?.split(" ").slice(1).join(" ") || "User",
                  avatar: user.image || "placeholder/avatar.png",
                  role: "customer",
                  receiveNews: false,
                  twoFactorEnabled: false,
                };

                const createResponse = await publicApi.post("/users", newUser);
                const createdUser = Array.isArray(createResponse)
                  ? createResponse[0]
                  : (createResponse?.data || createResponse);
                if (!createdUser || !createdUser.id) {
                  throw new Error("Failed to create user during OAuth sign-in.");
                }
                existingUser = createdUser;
              }
            } catch (doubleCheckError) {
              throw doubleCheckError;
            }
          }
          return true;
        } catch (error) {
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || "customer";
        token.id = user.id;
      }

      if (account && OAUTH_PROVIDERS.includes(account.provider)) {
        try {
          const response = await publicApi.get(`/users?email=${token.email}`);
          
          const users = Array.isArray(response) 
            ? response 
            : (response?.data || response);

          if (users && Array.isArray(users) && users.length > 0) {
            const dbUser = users[0];
            token.role = dbUser.role;
            token.id = dbUser.id;
          }
        } catch (error) {
          // Ignore errors and proceed
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
};
