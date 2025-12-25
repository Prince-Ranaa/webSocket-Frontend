"use client";

import { useState } from "react";
import { postJson } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signup = async () => {
    try {
      setError("");

      const res = await postJson("/auth/signup", {
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.user.id);

      router.push("/chat");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          className="border w-full p-2 mb-3 rounded"
          placeholder="Full Name"
          value={username}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border w-full p-2 mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border w-full p-2 mb-3 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signup}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
