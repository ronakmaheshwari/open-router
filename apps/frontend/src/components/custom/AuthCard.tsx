import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router";
import { treaty } from "@elysiajs/eden/treaty2";
import { toast } from "sonner";
import type { App } from "primary-backend";

const backendUrl =
  window.env_?.BACKEND_URL || import.meta.env.VITE_BACKEND_URL
  
if(!backendUrl) {
    throw new Error("No Backend url")
}

const client = treaty<App>(backendUrl);

interface AuthProps {
  type: "signup" | "signin";
}

export default function AuthCard({ type }: AuthProps) {
  const isSignup = type === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (isSignup && !name)) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = isSignup
        ? await client.api.v1.auth["signup"].post({
            name,
            email,
            password,
          })
        : await client.api.v1.auth["login"].post({
            email,
            password,
          });

      if (res.status === 200 || res.status === 201) {
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
        }

        toast.success(
          isSignup
            ? "Account created successfully!"
            : "Signed in successfully!"
        );

      } else {
        toast.error(res.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#020617] relative overflow-hidden">
      <div className="absolute w-125 h-125 bg-blue-600/20 blur-[140px] rounded-full -top-40 -left-40" />
      <div className="absolute w-125 h-125 bg-purple-600/20 blur-[140px] rounded-full -bottom-40 -right-40" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-4">
            <span className="text-blue-400 font-bold text-2xl">✦</span>
          </div>

          <h1 className="text-3xl font-bold text-white">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            {isSignup
              ? "Sign up to start your journey with us."
              : "Login to continue to your dashboard."}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="h-12 pl-11 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-12 pl-11 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>

                {!isSignup && (
                  <button
                    type="button"
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />

                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 pl-11 pr-11 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {loading
                ? "Loading..."
                : isSignup
                ? "Create Account"
                : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-gray-500">
              or continue with
            </span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="h-11 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700">
              Google
            </button>

            <button className="h-11 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700">
              GitHub
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <Link
            to={isSignup ? "/signin" : "/signup"}
            className="ml-2 text-blue-400 hover:text-blue-300 font-medium"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </Link>
        </p>
      </div>
    </div>
  );
}