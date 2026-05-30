import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { getAllTracks } from "../constants/tracks";
import { logout } from "../services/authService";

const courseLinksByTrack = {
  technology: [
    { label: "Phát triển Web Full-stack", path: "/course/1" },
    { label: "Phân tích dữ liệu và AI", path: "/course/2" },
    { label: "DevOps và Cloud", path: "/course/4" },
    { label: "AI Engineering", path: "/course/5" },
  ],
  creative: [
    { label: "Thiết kế UX/UI", path: "/course/6" },
    { label: "Sản xuất Video", path: "/course/7" },
    { label: "Đồ họa và Thương hiệu", path: "/course/8" },
  ],
  business: [
    { label: "Founder Academy", path: "/course/9" },
    { label: "Digital Marketing", path: "/course/10" },
    { label: "Tài chính kế toán", path: "/course/11" },
    { label: "Lãnh đạo quản lý", path: "/course/12" },
  ],
};

const navLinks = [
  { label: "Khóa học", path: "/courses" },
  { label: "Lộ trình", path: "/roadmap" },
  { label: "Doanh nghiệp", path: "/business" },
  { label: "Blog", path: "/blog" },
  { label: "Tư vấn", path: "/faq" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState("technology");
  const menuRef = useRef(null);
  const tracks = getAllTracks();
  const closeMenus = () => {
    setOpen(false);
    setMobileOpen(false);
  };

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileOpen);
    return () => document.body.classList.remove("menu-open");
  }, [mobileOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed inset-x-0 top-0 z-50 ">
      <div className="border-b border-black/10 bg-[var(--ws-surface-dark)] text-white">
        <div className="ws-section flex min-h-9 items-center justify-between gap-3 text-xs">
          <p className="text-white/72">Lộ trình học tập có mentor, dự án thật và đầu ra nghề nghiệp rõ ràng.</p>
          <Link to="/faq" className="hidden font-semibold text-[var(--ws-primary)] sm:inline-flex">
            Tư vấn miễn phí
          </Link>
        </div>
      </div>

      <nav className="border-b border-[var(--ws-border)] bg-white/88 backdrop-blur-xl">
        <div className="ws-section flex min-h-[var(--ws-header-height)] items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-3 rounded-full px-1 py-1 text-left"
            aria-label="Về trang chủ WeSkill"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ws-primary-soft)] border-2 border-transparent transition-all duration-300 group-hover:border-[var(--ws-primary)] group-hover:shadow-md">
              <img src="/img/logo.png" alt="WeSkill Logo" className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105" />
            </span>
            <span>
              <span className="block text-lg font-extrabold leading-none text-[var(--ws-ink)]">WeSkill</span>
              <span className="block text-xs text-[var(--ws-ink-soft)]">Learning paths for modern careers</span>
            </span>
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition ${
                  open ? "bg-[var(--ws-primary-soft)] text-[var(--ws-primary-strong)]" : "text-[var(--ws-ink)] hover:bg-[var(--ws-surface-strong)]"
                }`}
                aria-expanded={open}
                aria-controls="ws-program-menu"
              >
                Chương trình
                <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
              </button>

              <div
                id="ws-program-menu"
                className={`absolute left-0 top-full mt-3 w-[920px] rounded-[28px] border border-[var(--ws-border)] bg-white p-5 shadow-[var(--ws-shadow-1)] transition ${
                  open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
                }`}
              >
                <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
                  <div className="rounded-[24px] border border-[var(--ws-border)] bg-[var(--ws-surface-strong)] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-ink-soft)]">Nhóm ngành</p>
                    <div className="mt-4 space-y-2">
                      {tracks.map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => setActiveTrack(track.id)}
                          className={`w-full rounded-[20px] border px-4 py-3 text-left transition ${
                            activeTrack === track.id
                              ? "border-[var(--ws-primary)] bg-white shadow-[var(--ws-shadow-2)]"
                              : "border-transparent bg-transparent hover:border-[var(--ws-border)] hover:bg-white"
                          }`}
                        >
                          <p className="font-semibold text-[var(--ws-ink)]">{track.name}</p>
                          <p className="mt-1 text-xs text-[var(--ws-ink-soft)]">{track.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-[var(--ws-border)] bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-ink-soft)]">Khóa học tiêu biểu</p>
                    <div className="mt-4 space-y-2">
                      {(courseLinksByTrack[activeTrack] || []).map((course) => (
                        <button
                          key={course.label}
                          type="button"
                          onClick={() => {
                            navigate(course.path);
                            closeMenus();
                          }}
                          className="flex w-full items-center justify-between rounded-[20px] border border-[var(--ws-border)] px-4 py-3 text-left text-sm font-semibold text-[var(--ws-ink)] transition hover:border-[var(--ws-primary)] hover:bg-[var(--ws-primary-soft)]"
                        >
                          <span>{course.label}</span>
                          <ArrowRight size={16} className="text-[var(--ws-ink-soft)]" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#101714_0%,#18241e_100%)] p-5 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Định hướng nhanh</p>
                    <h3 className="mt-4 text-2xl font-extrabold leading-tight">Thiết kế lại trải nghiệm học tập xoay quanh mục tiêu nghề nghiệp.</h3>
                    <p className="mt-3 text-sm leading-6 text-white/72">
                      Hệ thống lộ trình, khóa học và tư vấn được gom về một nhịp đọc rõ ràng, dễ ra quyết định.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/courses");
                        closeMenus();
                      }}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--ws-primary)] px-5 py-3 text-sm font-bold text-white"
                    >
                      Xem tất cả khóa học
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={closeMenus}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.path)
                    ? "bg-[var(--ws-primary-soft)] text-[var(--ws-primary-strong)]"
                    : "text-[var(--ws-ink)] hover:bg-[var(--ws-surface-strong)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {(user?.role === "admin" || user?.role === "instructor") && (
              <Link
                to="/admin"
                onClick={closeMenus}
                className={`rounded-full px-4 py-3 text-sm font-semibold transition ${
                  isActive("/admin")
                    ? "bg-[var(--ws-primary-soft)] text-[var(--ws-primary-strong)]"
                    : "text-[var(--ws-ink)] hover:bg-[var(--ws-surface-strong)]"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {user?.isLoggedIn ? (
              <>
                <span className="max-w-52 truncate text-sm text-[var(--ws-ink-soft)]">{user.name || user.email}</span>
                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    window.location.href = "/";
                  }}
                  className="ws-button-secondary"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => {
                  closeMenus();
                  navigate("/login");
                }} className="ws-button-secondary">
                  Đăng nhập
                </button>
                <button type="button" onClick={() => {
                  closeMenus();
                  navigate("/signup");
                }} className="ws-button-primary">
                  Đăng ký
                </button>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--ws-border)] bg-white text-[var(--ws-ink)] lg:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-[var(--ws-border)] bg-white lg:hidden">
            <div className="ws-section space-y-4 py-5">
              <div className="rounded-[24px] border border-[var(--ws-border)] bg-[var(--ws-surface-strong)] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-ink-soft)]">Nhóm ngành</p>
                <div className="mt-3 grid gap-2">
                  {tracks.map((track) => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => {
                        closeMenus();
                        navigate("/courses", { state: { filter: track.id } });
                      }}
                      className="rounded-[18px] border border-[var(--ws-border)] bg-white px-4 py-3 text-left"
                    >
                      <p className="font-semibold text-[var(--ws-ink)]">{track.name}</p>
                      <p className="mt-1 text-xs text-[var(--ws-ink-soft)]">{track.courseCount} khóa học</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenus}
                    className={`rounded-[18px] border px-4 py-3 text-sm font-semibold ${
                      isActive(link.path)
                        ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)] text-[var(--ws-primary-strong)]"
                        : "border-[var(--ws-border)] bg-white text-[var(--ws-ink)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="grid gap-2">
                {user?.isLoggedIn ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      window.location.href = "/";
                    }}
                    className="ws-button-secondary w-full"
                  >
                    Đăng xuất
                  </button>
                ) : (
                  <>
                    <button type="button" onClick={() => {
                      closeMenus();
                      navigate("/login");
                    }} className="ws-button-secondary w-full">
                      Đăng nhập
                    </button>
                    <button type="button" onClick={() => {
                      closeMenus();
                      navigate("/signup");
                    }} className="ws-button-primary w-full">
                      Đăng ký
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
