"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, Mail, User, Check, X } from "lucide-react";
import { registerUser } from "@/services/auth.service";

const Rule = ({ valid, children }) => {
  return (
    <div
      className={`flex items-center gap-2 text-xs ${
        valid ? "text-green-600" : "text-slate-500"
      }`}
    >
      {valid ? (
        <Check size={14} strokeWidth={2.5} />
      ) : (
        <X size={14} strokeWidth={2} />
      )}

      <span>{children}</span>
    </div>
  );
};

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const password = formData.password;

  const passwordRules = {
    length: password.length >= 8 && password.length <= 20,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9\s]/.test(password),
  };

  // Password is valid only when ALL rules are valid
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation/server error when user changes the form
    if (submitted) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate API requests
    if (loading) return;

    setSubmitted(true);
    setError("");

    // Validate password
    if (!isPasswordValid) {
      setError(
        "Please create a stronger password using the requirements below.",
      );
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);

      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
          {/* =========================
              LEFT SECTION
          ========================== */}
          <div className="hidden bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              {/* Logo */}
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-slate-900">
                  E
                </div>

                <span className="text-2xl font-bold">EduFlow</span>
              </div>

              {/* Heading */}
              <h1 className="max-w-md text-4xl font-bold leading-tight">
                Start your learning journey with EduFlow.
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-md text-slate-300">
                Learn new skills, manage your courses, complete assignments, and
                grow with a modern learning experience.
              </p>
            </div>

            <p className="text-sm text-slate-400">Learn. Build. Grow.</p>
          </div>

          {/* =========================
              RIGHT SECTION
          ========================== */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              {/* Mobile Logo */}
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 font-bold text-white">
                  E
                </div>

                <span className="text-xl font-bold text-slate-900">
                  EduFlow
                </span>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Join EduFlow and start learning today.
                </p>
              </div>

              {/* =========================
                  ERROR MESSAGE
              ========================== */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                  <X size={18} className="mt-0.5 shrink-0 text-red-500" />

                  <p className="text-sm leading-5 text-red-600">{error}</p>
                </div>
              )}

              {/* =========================
                  FORM
              ========================== */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* =========================
                    USERNAME
                ========================== */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* =========================
                    EMAIL
                ========================== */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* =========================
                    PASSWORD
                ========================== */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      disabled={loading}
                      className={`w-full rounded-xl border bg-white py-3 pl-10 pr-12 text-sm text-slate-900 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                        submitted && !isPasswordValid
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                          : isPasswordValid
                            ? "border-green-300 focus:border-green-500 focus:ring-green-500/10"
                            : "border-slate-300 focus:border-slate-900 focus:ring-slate-900/10"
                      }`}
                    />

                    {/* Show / Hide Password */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 disabled:cursor-not-allowed"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* =========================
                      PASSWORD REQUIREMENTS
                  ========================== */}
                  {password.length > 0 ? (
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Rule valid={passwordRules.length}>8–20 characters</Rule>

                      <Rule valid={passwordRules.uppercase}>
                        One uppercase letter
                      </Rule>

                      <Rule valid={passwordRules.lowercase}>
                        One lowercase letter
                      </Rule>

                      <Rule valid={passwordRules.number}>One number</Rule>

                      <Rule valid={passwordRules.special}>
                        One special character
                      </Rule>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Use 8–20 characters with uppercase, lowercase, number, and
                      special character.
                    </p>
                  )}
                </div>

                {/* =========================
                    SUBMIT BUTTON
                ========================== */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              {/* =========================
                  LOGIN
              ========================== */}
              <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-slate-900 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
