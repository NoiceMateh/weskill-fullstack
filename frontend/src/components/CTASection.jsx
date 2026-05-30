import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-16">
      <div className="ws-section">
        <div className="overflow-hidden rounded-[36px] bg-[linear-gradient(135deg,#111714_0%,#1f2d25_45%,#66bb55_100%)] p-8 text-white md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Next action</p>
              <h2 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
                Sẵn sàng bắt đầu một lộ trình học có cấu trúc, có mentor và có đầu ra rõ ràng?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
                Tham gia cộng đồng học tập của WeSkill để được tư vấn lộ trình, hỗ trợ học tập và kết nối với các chuyên gia trong ngành. Đăng ký ngay hôm nay để bắt đầu hành trình phát triển kỹ năng của bạn!
              </p>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => {
                  const user = JSON.parse(localStorage.getItem("user") || "null");
                  if (user && user.isLoggedIn) {
                    navigate("/faq");
                  } else {
                    navigate("/login");
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-[20px] bg-white px-5 py-4 text-sm font-bold text-[var(--ws-primary-strong)] transition hover:bg-[var(--ws-page)]"
              >
                Đăng ký tư vấn miễn phí
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => navigate("/courses")}
                className="inline-flex items-center justify-center rounded-[20px] border border-white/28 bg-white/8 px-5 py-4 text-sm font-semibold text-white transition hover:bg-white/14"
              >
                Xem danh sách khóa học
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
