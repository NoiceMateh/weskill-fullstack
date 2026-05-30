import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllTracks } from "../constants/tracks";
import { PLACEHOLDER_HERO } from "../assets/placeholders";

function Hero() {
  const navigate = useNavigate();
  const tracks = getAllTracks();

  return (
    <section className="relative overflow-hidden pt-[132px]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top_right,rgba(102,187,85,0.18),transparent_28%),linear-gradient(180deg,#fbfcf8_0%,rgba(251,252,248,0)_100%)]" />
      <div className="ws-section relative grid gap-10 pb-16 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="ws-animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-[rgba(102,187,85,0.18)] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-primary-strong)]">
            <span className="h-2 w-2 rounded-full bg-[var(--ws-primary)]" />
            Hệ sinh thái học tập VEDU
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] text-[var(--ws-ink)] md:text-6xl">
            Học kỹ năng mới theo lộ trình rõ ràng, nội dung gọn và sát công việc thật.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--ws-ink-soft)] md:text-lg">
            WeSkill cung cấp lộ trình học tập được thiết kế bởi chuyên gia, nội dung cô đọng và cập nhật liên tục, giúp bạn phát triển kỹ năng theo cách hiệu quả nhất.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate("/courses")} className="ws-button-primary">
              Khám phá khóa học
              <ArrowRight size={16} />
            </button>
            <button type="button" onClick={() => navigate("/faq")} className="ws-button-secondary">
              <PlayCircle size={16} />
              Nhận tư vấn miễn phí
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { value: "92%", label: "Học viên có đầu ra rõ ràng" },
              { value: "12+", label: "Khóa học theo nhóm nghề" },
              { value: "1:1", label: "Mentor feedback theo tiến độ" },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-[var(--ws-border)] bg-white/88 p-4 shadow-[var(--ws-shadow-2)]">
                <p className="text-2xl font-extrabold text-[var(--ws-ink)]">{item.value}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--ws-ink-soft)]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative ws-animate-fade-up-delay-1">
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[rgba(102,187,85,0.2)] blur-2xl" />
          <div className="ws-card overflow-hidden rounded-[32px] p-3">
            <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative overflow-hidden rounded-[28px]">
                <img src={PLACEHOLDER_HERO} alt="Học viên đang tham gia lớp học tại WeSkill" className="h-[420px] w-full object-cover" />
                <div className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/20 bg-[rgba(16,23,20,0.82)] p-4 text-white backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Course flow</p>
                  <p className="mt-2 text-lg font-bold">Đọc mô tả, lọc nhanh, chọn format học, đăng ký ngay trong một nhịp.</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="rounded-[28px] bg-[linear-gradient(180deg,#111714_0%,#1d2b24_100%)] p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Nguyên tắc giao diện</p>
                  <div className="mt-4 space-y-3">
                    {[
                      "Thiết kế tối ưu cho người học, tập trung vào nội dung và trải nghiệm học tập.",
                      "Giao diện đơn giản, trực quan, dễ dàng điều hướng và tìm kiếm thông tin.",
                      "CTA rõ, trạng thái focus và hover tách bạch.",
                    ].map((item) => (
                      <div key={item} className="flex gap-3">
                        <CheckCircle2 size={18} className="mt-0.5 text-[var(--ws-primary)]" />
                        <p className="text-sm leading-6 text-white/78">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[28px] border border-[var(--ws-border)] bg-white p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-ink-soft)]">Lộ trình chính</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tracks.map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => navigate("/courses", { state: { filter: track.id } })}
                        className="rounded-full border border-[var(--ws-border)] bg-[var(--ws-surface-strong)] px-4 py-2 text-sm font-semibold text-[var(--ws-ink)] transition hover:border-[var(--ws-primary)] hover:text-[var(--ws-primary-strong)]"
                      >
                        {track.name}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[var(--ws-ink-soft)]">
                    Tất cả lộ trình học tập được thiết kế bởi chuyên gia, cập nhật liên tục theo xu hướng công việc và phản hồi của học viên.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
