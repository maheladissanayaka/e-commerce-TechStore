"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              className="w-full p-2 border rounded mt-1"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-sm font-medium">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              className="w-full p-2 border rounded mt-1"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm">
          Don't have an account? <Link href="/register" className="text-blue-600">Register</Link>
        </p>
      </div>
    </div>
  );
}