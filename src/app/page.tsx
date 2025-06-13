"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = authClient.useSession();

  const [tab, setTab] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setName("");
    setPassword("");
  };

  const onRegister = () => {
    if (!email || !name || !password) {
      alert("All fields are required.");
      return;
    }
    setIsLoading(true);
    authClient.signUp.email(
      { email, name, password },
      {
        onError: () => {
          setIsLoading(false);
          alert("Something went wrong!");
        },
        onSuccess: () => {
          setIsLoading(false);
          alert("Successfully registered!");
          resetForm();
        },
      }
    );
  };

  const onLogin = () => {
    if (!email || !password) {
      alert("Email and Password required.");
      return;
    }
    setIsLoading(true);
    authClient.signIn.email(
      { email, password },
      {
        onError: () => {
          setIsLoading(false);
          alert("Login failed!");
        },
        onSuccess: () => {
          setIsLoading(false);
          alert("Logged in!");
          resetForm();
        },
      }
    );
  };

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-green-50 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-green-700 mb-4">
            Welcome, {session.user.name} 👋
          </h1>
          <p className="mb-6 text-sm text-green-800">{session.user.email}</p>
          <Button onClick={() => authClient.signOut()} className="bg-green-600 hover:bg-green-700 text-white">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="bg-green-50 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between mb-6">
          <button
            className={`font-semibold text-lg ${
              tab === "register" ? "text-green-700" : "text-gray-400"
            }`}
            onClick={() => setTab("register")}
          >
            Register
          </button>
          <button
            className={`font-semibold text-lg ${
              tab === "login" ? "text-green-700" : "text-gray-400"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
        </div>

        <div className="space-y-4">
          {tab === "register" && (
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border-green-300 focus:ring-green-500"
              disabled={isLoading}
            />
          )}

          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white border-green-300 focus:ring-green-500"
            disabled={isLoading}
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white border-green-300 focus:ring-green-500"
            disabled={isLoading}
          />

          <Button
            onClick={tab === "register" ? onRegister : onLogin}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? "Please wait..." : tab === "register" ? "Sign Up" : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
