// components/Login.tsx
"use client"; // Marking this file as a Client Component

import React, { useState } from "react";
import { auth } from "../firebase"; // Adjust the import path based on your structure
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation"; // Use next/navigation for routing

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the router

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;
      alert("Login successful!");
      router.push(`/Test?uid=${uid}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-auto max-w-xs mx-auto  rounded-lg border border-cyan-300 shadow-blue-300 shadow-xl bg-gray-900">
      <div className=" my-6 mx-3">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4  text-black">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded py-2 w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4">
          Dont have an account?{" "}
          <a href="/Register" className="text-blue-500">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
