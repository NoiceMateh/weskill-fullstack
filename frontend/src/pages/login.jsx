import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      await login({ email, password });
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      } else {
        navigate("/courses");
      }
    } catch (error) {
      setErrorMessage(error.message || "Đăng nhập thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ws-page)] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[var(--ws-border)] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[var(--ws-ink)]">Đăng nhập</h1>
        <p className="mt-2 text-sm text-[var(--ws-muted)]">Tiếp tục hành trình học tập của bạn.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errorMessage && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--ws-muted)]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--ws-border)] px-4 py-2.5 focus:border-[var(--ws-primary)] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--ws-muted)]">Mat khau</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--ws-border)] px-4 py-2.5 focus:border-[var(--ws-primary)] focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[var(--ws-primary)] py-3 font-semibold text-white hover:bg-[var(--ws-primary-strong)] disabled:opacity-60"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <p className="mt-5 text-sm text-[var(--ws-muted)]">
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="font-semibold text-[var(--ws-ink)] underline-offset-2 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}



