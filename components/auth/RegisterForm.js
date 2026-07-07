"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AuthTopBar from "@/components/auth/AuthTopBar";
import AuthBanner from "@/components/auth/AuthBanner";
import PhoneInput from "@/components/auth/PhoneInput";
import PasswordInput from "@/components/auth/PasswordInput";
import { register as registerRequest } from "@/lib/authApi";
import { saveAuth } from "@/lib/auth";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    mobile: "",
    password: "",
    confirmPassword: "",
    inviteCode: "",
  });
  const [agree, setAgree] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setForm((prev) => ({ ...prev, inviteCode: ref.trim().toUpperCase() }));
    }
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agree) {
      setError("Please agree to the Privacy Agreement");
      return;
    }

    setLoading(true);

    try {
      const response = await registerRequest({
        name: `Player${form.mobile.slice(-4) || "01"}`,
        mobile: form.mobile,
        password: form.password,
        referralCode: form.inviteCode.trim().toUpperCase() || undefined,
      });
      saveAuth(response.data);
      router.push("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <AuthTopBar />
      <AuthBanner
        title="Register"
        subtitle="Please register by phone number or email"
      />

      <div className="auth-body">
        <div className="auth-method-head">
          <span>📱</span>
          <span>Register your phone</span>
        </div>
        <div className="auth-divider" />

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="mobile">
              📱 Phone Number
            </label>
            <PhoneInput value={form.mobile} onChange={handleChange} />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              🔒 Set Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Set password"
              minLength={6}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirmPassword">
              🔒 Confirm Password
            </label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              minLength={6}
            />
          </div>

          <div className="auth-field auth-invite-field">
            <label className="auth-label" htmlFor="inviteCode">
              Invite code <span className="auth-label-optional">(optional)</span>
            </label>
            <input
              id="inviteCode"
              name="inviteCode"
              type="text"
              value={form.inviteCode}
              onChange={handleChange}
              placeholder="Enter partner or friend code"
              className="auth-input"
              autoComplete="off"
            />
          </div>

          <label className="auth-check-row">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            I have read and agree{" "}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer">
              【Privacy Agreement】
            </Link>
          </label>

          <button className="auth-btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <Link href="/login" className="auth-btn-outline-dark">
            I have an account <strong>Login</strong>
          </Link>
        </form>
      </div>
    </main>
  );
}
