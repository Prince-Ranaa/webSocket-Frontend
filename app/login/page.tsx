"use client";

import { useState } from "react";
import { postJson } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    try {
      setError("");

      const res = await postJson("/auth/login", { email, password });

      console.log(res);
      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.user._id);

      router.push("/chat");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

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
          onClick={login}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>

        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-green-600">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
