"use client";

export default function TermsSection() {
  return (
    <section className="terms-section">

      <div className="terms-top">
        <div className="age-icon">18+</div>

        <a
          href="https://t.me/yourchannel"
          target="_blank"
          rel="noopener noreferrer"
          className="telegram-icon"
        >
          ✈
        </a>
      </div>

      <h3 className="terms-title">
        Responsible Gaming
      </h3>

      <div className="terms-content">

        <p>Players must be 18 years or older.</p>

        <p>LuckyNova provides fair, secure and transparent gaming.</p>

        <p>Fast deposits and withdrawals are available.</p>

        <p>Promotions are subject to their respective terms.</p>

        <p>Please play responsibly and within your limits.</p>

        <div className="warning">
          ⚠ Gambling can be addictive. Please play responsibly.
        </div>

      </div>

    </section>
  );
}