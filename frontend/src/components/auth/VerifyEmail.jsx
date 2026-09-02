"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { verifyEmail } from "@/services/auth.service";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Maximum 6 digits
    if (value.length > 6) {
      return;
    }

    setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Email address is missing.");
      return;
    }

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const data = await verifyEmail({
        email,
        otp,
      });

      console.log("Verify Email Response:", data);

      setSuccess("Email verified successfully!");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
          "Unable to verify OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
          {/* Left Section */}
          <div className="hidden bg-slate-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-slate-900">
                  E
                </div>

                <span className="text-2xl font-bold">EduFlow</span>
              </div>

              <h1 className="max-w-md text-4xl font-bold leading-tight">
                One step away from starting your journey.
              </h1>

              <p className="mt-5 max-w-md text-slate-300">
                Verify your email address to secure your account and continue
                learning with EduFlow.
              </p>
            </div>

            <p className="text-sm text-slate-400">Learn. Build. Grow.</p>
          </div>

          {/* Right Section */}
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

              {/* Icon */}
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <MailCheck size={28} className="text-slate-900" />
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Verify your email
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  We sent a 6-digit verification code to
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-900">
                  {email || "your email address"}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Verification code
                  </label>

                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-center text-xl font-semibold tracking-[0.5em] text-slate-900 placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify email"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
                >
                  <ArrowLeft size={16} />
                  Back to registration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
