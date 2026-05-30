import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-14 border-t border-[var(--ws-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9f5_100%)]">
      <div className="ws-section grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <div className="group flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ws-primary-soft)] border-2 border-transparent transition-all duration-300 group-hover:border-[var(--ws-primary)]">
              <img src="/img/logo.png" alt="WeSkill Logo" className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105" />
            </span>
            <div>
              <p className="text-lg font-extrabold text-[var(--ws-ink)]">WeSkill</p>
              <p className="text-sm text-[var(--ws-ink-soft)]">Modern learning for career growth</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--ws-ink-soft)]">
            Nền tảng học tập cho người cần một lộ trình kỹ năng rõ ràng, mentor đồng hành và trải nghiệm đăng ký gọn, dễ hiểu.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--ws-ink)]">Khóa học</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--ws-ink-soft)]">
            <li><Link to="/course/1">Lập trình Web Full-stack</Link></li>
            <li><Link to="/course/2">Phân tích dữ liệu và AI</Link></li>
            <li><Link to="/course/6">Thiết kế UX/UI</Link></li>
            <li><Link to="/course/4">DevOps & Cloud</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--ws-ink)]">Điều hướng</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--ws-ink-soft)]">
            <li><Link to="/about">Về WeSkill</Link></li>
            <li><Link to="/mentor">Đội ngũ mentor</Link></li>
            <li><Link to="/business">Giải pháp doanh nghiệp</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/faq">Hỏi đáp</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--ws-ink)]">Liên hệ</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--ws-ink-soft)]">
            <li>72 Lê Thánh Tôn, Quận 1, TP.HCM</li>
            <li><a href="mailto:hello@weskill.vn">hello@weskill.vn</a></li>
            <li><a href="tel:02812345678">028 1234 5678</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--ws-border)]">
        <div className="ws-section flex flex-col gap-3 py-5 text-xs text-[var(--ws-ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 WeSkill Vietnam JSC. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4">
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
