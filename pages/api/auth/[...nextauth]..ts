import NextAuth, { Session } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import { authenticateUser } from "@/utils/authenticateUser";
// import jwt from "jsonwebtoken";

export default NextAuth({

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        ////console.log("Inside authorize function");

        if (!credentials) {
          throw new Error("Credentials are missing!");
        }

        const { email, password } = credentials;
        if (!email || !password) {
          throw new Error("Email or password is missing");
        }
        try {
          const user = await authenticateUser(credentials.email, credentials.password);
          //console.log("User from authenticateUser:", user);

          return user;
        } catch (error: any) {
          console.error("Error in authorize function:", error.message);

          throw new Error("Invalid login credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // custom path for your login page if any
    // ... other pages if you customize them
  },
  callbacks: {
    // async jwt(params) {
    //   //console.log("params:====", params)
    //   //console.log(process.env.JWT_SECRET, "process.env.JWT_SECRET")
    //   const { token, user } = params;

    //   if (user) {
    //     token.id = user.id;
    //   }

    //   return token;
    // }

    async session(params) {
      // //console.log("dhiwhdw");
      const { session, token } = params;
      //console.log(session, token.id, "hashahuis", params);
      if (!session.user) {
        session.user = {
          id: '',
          email: '',
          name: ''
        };
      }

      // if(!token.id) {
      //   token.id = "";
      // }

      if (token && token.id) {
        session.user.id = token.id;
      }
      // session.user.id = user.id;
      return session;
    },

    async redirect({ url, baseUrl, user }) {
      // If user is signing in, redirect to profile page.
      if (url === baseUrl && user && user.id) {
        return `/profile/${user.id}`;
      }
      // Otherwise, continue with the original URL.
      return url;
    },

    // async signIn({ user, account, profile, email, credentials }) { return true },
    async jwt(params) {
      const { token, user } = params;
      if (user) {
        token.id = user.id;
      }
      return token;
    }


  },
  secret: process.env.JWT_SECRET, // Same secret you're currently using
  jwt: {
    // A secret to use for key generation (you should set this explicitly)
    secret: process.env.JWT_SECRET,
    // Set to true to use encryption (default: false)
    // encryption: true,
    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  debug: true,
  // ... rest of your next-auth configuration

});

