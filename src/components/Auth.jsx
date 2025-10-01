// src/components/Auth.jsx

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.error_description || error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#20212C]">
      <div className="w-full max-w-sm space-y-6 rounded-lg bg-[#2B2C37] p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-white">
          Kanban Task Manager
        </h1>
        <p className="text-center text-gray-400">
          Sign in or create an account
        </p>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="mt-1 border-gray-600 bg-[#20212C] text-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="mt-1 border-gray-600 bg-[#20212C] text-white"
            />
          </div>
          <div className="flex flex-col space-y-2 items-center justify-between">
            <Button
              type="submit"
              className="w-full bg-[#635FC7] hover:bg-[#A8A4FF] text-sm cursor-pointer"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </Button>
            <Button
              onClick={handleSignUp}
              className="w-full bg-white text-[#635FC7] hover:bg-gray-200 text-sm cursor-pointer"
              disabled={loading}
            >
              {loading ? "..." : "Sign Up"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
