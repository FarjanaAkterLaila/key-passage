"use client";

import { useState } from "react";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";

export function LoginForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`${serverUrl}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = (await response.json()) as { email?: string; message?: string };
      if (!response.ok) {
        setError(body.message ?? "Could not open the door.");
        return;
      }
      setMessage(
        mode === "register"
          ? `Account ready for ${body.email}. You can sign in.`
          : `Welcome back, ${body.email}.`,
      );
    } catch {
      setError("The server is not running. Start it with pnpm dev:server.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-[#6f6a62]">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-[#e4ddd2] bg-white px-3 py-2 text-[#2c2a26]"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-[#6f6a62]">
        Password
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-[#e4ddd2] bg-white px-3 py-2 text-[#2c2a26]"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#5f6f62] px-4 py-3 text-[#f3efe7] disabled:opacity-60"
      >
        {pending ? "Please wait" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      <button
        type="button"
        className="text-sm text-[#a68b5b]"
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setError("");
          setMessage("");
        }}
      >
        {mode === "login" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
      {error ? <p className="text-sm text-[#8c5e52]">{error}</p> : null}
      {message ? <p className="text-sm text-[#5f6f62]">{message}</p> : null}
    </form>
  );
}
