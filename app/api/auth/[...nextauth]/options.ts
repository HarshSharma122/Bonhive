import { connectDb } from "@/lib/db";
import USER from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text" },
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },

      async authorize(credentials) {
        if (
          !credentials?.username ||
          !credentials?.email ||
          !credentials?.password
        ) {
          throw new Error("Please provide username, email and password");
        }

        try {
          await connectDb();
          const user = await USER.findOne({
            email: credentials.email,
            username: credentials.username,
          });

          if (!user) {
            throw new Error("No user found!");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("invalid password");
          }
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
          };
        } catch (error) {
          console.error("Auth error: ", error);
          throw error;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  events: {
   signIn: async ({ user }) => {
      try {
        await fetch("https://api.useplunk.com/v1/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PLUNK_API_KEY}`,
          },
          body: JSON.stringify({
            event: "welcome_email",
            email: user.email,
            data: {
              name: user.name,
              message: `
            <h1>Welcome, ${user.name}</h1>
            <p>Welcome to Bonhive! 🎉We’re excited to help you manage your projects, clients, and deadlines all in one place. Here’s a quick tip to get started:<p>
            <p>1.Add your first project</p>
            <p>2.Download the invoice</p>
            <p>3. Track progress effortlessly</p>
        
            <p>Need help? Our support team is here for you anytime.
 Happy freelancing,
The Bonhive Team</p>
          `,
            },
          }),
        });
      } catch (err) {
        console.error("Plunk error:", err);
      }
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
