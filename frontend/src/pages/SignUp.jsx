import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });
      await login({ email: formData.email, password: formData.password });
      const redirectUrl = localStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectUrl);
      } else {
        navigate("/courses");
      }
    } catch (error) {
      setErrorMessage(error.message || "Đăng ký thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ws-page)] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-[var(--ws-border)] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-[var(--ws-ink)]">Đăng ký tai khoan</h1>
        <p className="mt-2 text-sm text-[var(--ws-muted)]">Thông tin đăng ký đồng bộ với schema backend.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errorMessage && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--ws-muted)]">Ho</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full rounded-lg border border-[var(--ws-border)] px-4 py-2.5 focus:border-[var(--ws-primary)] focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--ws-muted)]">Ten</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full rounded-lg border border-[var(--ws-border)] px-4 py-2.5 focus:border-[var(--ws-primary)] focus:outline-none" required />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--ws-muted)]">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-[var(--ws-border)] px-4 py-2.5 focus:border-[var(--ws-primary)] focus:outline-none" required />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[var(--ws-muted)]">Số điện thoại</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-[var(--ws-border)] px-4 py-2.5 focus:border-[var(--ws-primary)] focus:outline-none" required />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--ws-muted)]">Mat khau</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full rounded-lg border border-[var(--ws-border)] px-4 py-2.5 focus:border-[var(--ws-primary)] focus:outline-none" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--ws-muted)]">Nhập lại mật khẩu</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-lg border border-[var(--ws-border)] px-4 py-2.5 focus:border-[var(--ws-primary)] focus:outline-none" required />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-[var(--ws-primary)] py-3 font-semibold text-white hover:bg-[var(--ws-primary-strong)] disabled:opacity-60">
            {isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
          </button>
        </form>

        <p className="mt-5 text-sm text-[var(--ws-muted)]">
          Da co tai khoan?{" "}
          <Link to="/login" className="font-semibold text-[var(--ws-ink)] underline-offset-2 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}



