import { useEffect, useState } from "react";
import ConsultChatbot from "../components/ConsultChatbot";
import { getSiteContent } from "../services/siteContentService";
import { toYoutubeEmbedUrl } from "../utils/youtube";

const FALLBACK_FAQS = [
  {
    id: "f1",
    question: "Học hybrid là gì?",
    answer:
      "Học hybrid kết hợp buổi trực tiếp và học trực tuyến, giúp linh hoạt thời gian và tăng tương tác với giảng viên.",
  },
  {
    id: "f2",
    question: "Các phương thức thanh toán?",
    answer: "Chuyển khoản, thẻ, ví điện tử và thanh toán tại trung tâm (nếu có).",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState(null);
  const [heroTitle, setHeroTitle] = useState("Tư vấn & Câu hỏi thường gặp");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [faqs, setFaqs] = useState(FALLBACK_FAQS);
  const [suggestions, setSuggestions] = useState([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const doc = await getSiteContent();
        if (!alive || !doc) return;
        if (doc.heroTitle) setHeroTitle(doc.heroTitle);
        if (doc.heroSubtitle != null) setHeroSubtitle(doc.heroSubtitle);
        if (doc.heroImageUrl) setHeroImageUrl(doc.heroImageUrl);
        if (doc.consultationYoutubeUrl) setYoutubeUrl(doc.consultationYoutubeUrl);
        if (Array.isArray(doc.faqs) && doc.faqs.length > 0) {
          setFaqs(
            doc.faqs
              .slice()
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
              .map((f, i) => ({
                id: `faq-${i}`,
                question: f.question,
                answer: f.answer,
              }))
          );
        }
        if (Array.isArray(doc.chatbotSuggestions)) setSuggestions(doc.chatbotSuggestions);
      } catch (e) {
        if (alive) setLoadError(e.message || "Không tải được nội dung từ máy chủ.");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const toggle = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const embed = toYoutubeEmbedUrl(youtubeUrl);

  return (
    <main className="min-h-screen pt-24">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(11,140,156,0.35),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--ws-primary)] via-[#0a7a88] to-[#064e56]" />
        {heroImageUrl && (
          <div
            className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
            style={{
              backgroundImage: `url(${heroImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center text-white">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.35em] text-teal-100/90">WeSkill · Tư vấn</p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">{heroTitle}</h1>
          <p className="mx-auto max-w-2xl text-lg text-teal-50/95">
            {heroSubtitle ||
              "Giải đáp nhanh về lộ trình, hình thức học và thanh toán. Chat trợ lý bên phải màn hình bất cứ lúc nào."}
          </p>
        </div>
      </section>

      {loadError && (
        <div className="mx-auto max-w-4xl px-6 pt-6">
          <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError}</p>
        </div>
      )}

      {embed && (
        <section className="mx-auto max-w-5xl px-6 py-10">
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5">
            <div className="aspect-video w-full bg-slate-900">
              <iframe
                title="Video tư vấn"
                src={embed}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="border-t border-slate-100 px-6 py-3 text-sm text-slate-600">
              Video giới thiệu / tư vấn, nội dung do quản trị cập nhật từ trang quản trị.
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Câu hỏi thường gặp</h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 shadow-sm backdrop-blur-sm transition hover:border-teal-200/80 hover:shadow-md"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-800 hover:text-[var(--ws-primary)]"
                onClick={() => toggle(faq.id)}
              >
                <span>{faq.question}</span>
                <span className="shrink-0 text-xl text-[var(--ws-primary)]">{openId === faq.id ? "−" : "+"}</span>
              </button>
              {openId === faq.id && <div className="border-t border-slate-100 px-5 py-4 leading-relaxed text-slate-600">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      <ConsultChatbot faqs={faqs} suggestions={suggestions} />
    </main>
  );
}
