export default function AuthBanner({ title, subtitle }) {
  return (
    <div className="auth-banner">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}
