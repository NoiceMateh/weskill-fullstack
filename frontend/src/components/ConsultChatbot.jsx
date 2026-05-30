import { useMemo, useRef, useState } from "react";

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const FALLBACK_REPLY = "Cảm ơn bạn đã nhắn tin. Đội ngũ WeSkill sẽ phản hồi sớm qua email hoặc hotline.";

function findFaqAnswer(faqs, text) {
  const q = normalize(text);
  if (!q.trim()) return FALLBACK_REPLY;

  for (const faq of faqs || []) {
    const question = normalize(faq.question || "");
    const answer = faq.answer || "";

    if (question && q.split(/\s+/).some((w) => w.length > 2 && question.includes(w))) {
      return answer || FALLBACK_REPLY;
    }

    if (answer && q.split(/\s+/).some((w) => w.length > 3 && normalize(answer).includes(w))) {
      return answer;
    }
  }

  if (q.includes("dang ky") || q.includes("dang ki")) {
    return "Bạn đăng nhập, chọn khóa học và hình thức phù hợp, sau đó hoàn tất thanh toán theo hướng dẫn.";
  }

  if (q.includes("thanh toan") || q.includes("hoc phi")) {
    return "Hệ thống hỗ trợ chuyển khoản, thẻ và ví điện tử. Bạn có thể xem chi tiết tại trang đăng ký khóa học.";
  }

  return FALLBACK_REPLY;
}

export default function ConsultChatbot({ faqs = [], suggestions = [] }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Xin chào! WeSkill có thể hỗ trợ thông tin khóa học, đăng ký và thanh toán.",
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const quick = useMemo(() => {
    const s = [...(suggestions || [])].filter(Boolean).slice(0, 4);
    if (s.length) return s;
    return ["Đăng ký khóa học", "Thanh toán", "Học hybrid là gì?", "Chứng chỉ"];
  }, [suggestions]);

  const send = (text) => {
    const t = (text || input).trim();
    if (!t) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", text: t }]);

    const answer = findFaqAnswer(faqs, t);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "bot", text: answer }]);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 180);
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[60] rounded-xl bg-[var(--ws-primary)] px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[var(--ws-primary-strong)]"
          aria-label="Mở chat tư vấn"
        >
          Tư vấn
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-[60] flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden rounded-2xl border border-[var(--ws-border)] bg-white shadow-2xl ws-animate-in">
          <div className="flex items-center justify-between border-b border-[var(--ws-border)] bg-[var(--ws-primary-soft)] px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[var(--ws-ink)]">Tư vấn WeSkill</p>
              <p className="text-xs text-[var(--ws-muted)]">Trả lời nhanh theo FAQ hệ thống</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-[var(--ws-border)] px-2 py-1 text-xs font-semibold text-[var(--ws-ink)] hover:bg-white"
            >
              Đóng
            </button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`ws-msg-in rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "ml-8 bg-[var(--ws-primary-soft)] text-[var(--ws-ink)]"
                    : "mr-6 border border-[var(--ws-border)] bg-[var(--ws-page)] text-[var(--ws-ink)]"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-[var(--ws-border)] px-3 py-2">
            {quick.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-[var(--ws-border)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--ws-ink)] hover:bg-[var(--ws-page)]"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            className="flex gap-2 border-t border-[var(--ws-border)] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="min-w-0 flex-1 rounded-xl border border-[var(--ws-border)] bg-white px-3 py-2 text-sm text-[var(--ws-ink)] placeholder:text-[var(--ws-muted)] focus:border-[var(--ws-primary)] focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-[var(--ws-primary)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--ws-primary-strong)]"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
}
