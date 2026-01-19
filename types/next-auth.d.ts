import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: string;
    id: string;
  }
  
  interface Session {
    user: {
      id: string; // This is the crucial line
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}