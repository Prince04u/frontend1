"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthTopBar from "@/components/auth/AuthTopBar";
import AuthBanner from "@/components/auth/AuthBanner";
import PhoneInput from "@/components/auth/PhoneInput";
import PasswordInput from "@/components/auth/PasswordInput";
import { login as loginRequest } from "@/lib/authApi";
import { saveAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ mobile: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginRequest(form);
      saveAuth(response.data);
      router.push("/");
    } catch (err) {
      if (!err.response) {
        setError("Server tak connection nahi ho pa raha. Internet check karo ya 30 sec baad dubara try karo (Render wake up).");
      } else if (err.response.status >= 500) {
        setError("Server error. 30 sec wait karke dubara try karo. Agar phir bhi ho to support ko batao.");
      } else {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <AuthTopBar />
      <AuthBanner
        title="Log in"
        subtitle="Please log in with your phone number. If you forget your password, please contact customer service."
      />

      <div className="auth-body">
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="mobile">
              📱 Phone number
            </label>
            <PhoneInput value={form.mobile} onChange={handleChange} />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              🔒 Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          <label className="auth-check-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember password
          </label>

          <button className="auth-btn-login" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>

          <Link href="/register" className="auth-btn-outline">
            Register
          </Link>
        </form>

        <div className="auth-footer-links">
          <Link href="/support" className="auth-footer-link">
            <span>💬</span>
            Customer Service
          </Link>
        </div>
      </div>
    </main>
  );
}
