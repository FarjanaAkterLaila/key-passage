import { LoginForm } from "./login-form";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="text-xs tracking-[0.18em] text-[#a68b5b]">THE KEY PASSAGE</p>
      <h1 className="mt-3 text-4xl text-[#2c2a26]">Open the first door</h1>
      <p className="mt-3 text-[#6f6a62]">
        Sign in to keep your place. The same account opens on another browser.
      </p>
      <LoginForm />
    </main>
  );
}
