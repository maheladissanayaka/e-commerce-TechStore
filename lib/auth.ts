import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();

        // Include 'role' in the selection
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  // 👇 UPDATED CALLBACKS HERE
  callbacks: {
    async jwt({ token, user }: any) {
      // If user logs in, add their ID and ROLE to the token
      if (user) {
        token.role = user.role;
        token.id = user._id.toString(); // <--- ADDED THIS
      }
      return token;
    },
    async session({ session, token }: any) {
      // Pass the ID and ROLE from the token to the session
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;     // <--- ADDED THIS
      }
      return session;
    },
  },
};