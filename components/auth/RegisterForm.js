"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import AuthTopBar from "@/components/auth/AuthTopBar";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref) {
      setForm((prev) => ({
        ...prev,
        inviteCode: ref.trim().toUpperCase(),
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!agree) {
      setError("Please agree to Privacy Agreement");
      return;
    }

    setLoading(true);

    try {
      const response = await registerRequest({
        name: `Player${form.mobile.slice(-4) || "01"}`,
        mobile: form.mobile,
        password: form.password,
        referralCode:
          form.inviteCode.trim().toUpperCase() || undefined,
      });

      saveAuth(response.data);
      router.push("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <AuthTopBar />

      <section className="premium-hero">

        <div className="premium-hero-content">

          <div className="premium-left">

            <h1 className="hero-title">
              Create Your
              <br />
              Account
            </h1>

            <p className="hero-subtitle">
              Create your account by phone number or email
            </p>

          </div>

          <div className="premium-right">

            <img
              src="/images/register-hero.png"
              alt="Register"
              className="hero-image"
            />

          </div>

        </div>

      </section>

      <section className="premium-form-section">

        <div className="register-card">

          <div className="register-tabs">

            <button
              type="button"
              className="active"
            >
              📱 Phone
            </button>

            <button
              type="button"
            >
              ✉ Email
            </button>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="premium-form"
          >

            <div className="premium-field">

              <label htmlFor="mobile">
                Phone Number
              </label>

              <PhoneInput
                value={form.mobile}
                onChange={handleChange}
              />

            </div>

            <div className="premium-field">

              <label htmlFor="password">
                Password
              </label>

              <PasswordInput
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                minLength={6}
              />
                  </div>

                     {/* Password Strength */}

            <div className="password-strength">
              <span>Password Strength</span>

              <div className="strength-bars">
                <span className={form.password.length >= 2 ? "active" : ""}></span>
                <span className={form.password.length >= 4 ? "active" : ""}></span>
                <span className={form.password.length >= 6 ? "active" : ""}></span>
                <span className={form.password.length >= 8 ? "active" : ""}></span>
              </div>
            </div>

            {/* Confirm Password */}

            <div className="premium-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                minLength={6}
              />
            </div>

            {/* Invite Code */}

            <div className="premium-field">
              <label htmlFor="inviteCode">
                Invite Code <small>(Optional)</small>
              </label>

              <input
                id="inviteCode"
                name="inviteCode"
                type="text"
                className="auth-input"
                value={form.inviteCode}
                onChange={handleChange}
                placeholder="Enter invite code"
                autoComplete="off"
              />
            </div>

            {/* Privacy */}

            <label className="premium-check">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />

              <span>
                I agree to the{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Agreement
                </Link>
              </span>
            </label>

            {/* Register Button */}

            <button
              className="premium-register-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login */}

            <Link
              href="/login"
              className="premium-login-btn"
            >
              Already have an account?
              <strong> Login</strong>
            </Link>

          </form>

          <div className="premium-features">

            <div className="feature-card">
              <div className="feature-icon">🛡</div>
              <h4>100% Secure</h4>
              <p>Your personal information is protected with advanced encryption.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Fast Registration</h4>
              <p>Create your account in less than one minute.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎁</div>
              <h4>Daily Rewards</h4>
              <p>Enjoy welcome bonuses and exclusive member rewards.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎧</div>
              <h4>24×7 Support</h4>
              <p>Our support team is available anytime you need help.</p>
            </div>

          </div>

        </div>

      </section>

    </main>

  );
}
