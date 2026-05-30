import { Quote } from "lucide-react";
import { PLACEHOLDER_AVATAR, TESTIMONIAL_AVATARS } from "../assets/placeholders";

const testimonials = [
  {
    id: 1,
    name: "Lê Hoàng Minh",
    job: "Frontend Developer",
    company: "Tiki",
    rating: 5,
    text: "Sau khóa học, mình chuyển từ trái ngành sang frontend và pass phỏng vấn trong 2 tháng.",
    avatar: TESTIMONIAL_AVATARS[1],
  },
  {
    id: 2,
    name: "Phạm Thị Thu",
    job: "Data Analyst",
    company: "MoMo",
    rating: 5,
    text: "Mentor review bài rất kỹ, bài tập sát dự án thực tế và dễ ứng tuyển hơn.",
    avatar: TESTIMONIAL_AVATARS[2],
  },
  {
    id: 3,
    name: "Nguyễn Khoa Nam",
    job: "Full-stack Developer",
    company: "Shopee",
    rating: 4.8,
    text: "Lộ trình rõ ràng, học xong có portfolio và CV được tối ưu trước khi đi phỏng vấn.",
    avatar: TESTIMONIAL_AVATARS[3],
  },
];

function Testimonials() {
  return (
    <section className="py-16">
      <div className="ws-section">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-primary-strong)]">Student feedback</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-[var(--ws-ink)] md:text-4xl">Đánh giá học viên được đưa về bố cục tĩnh, rõ và dễ so sánh.</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--ws-ink-soft)]">
            Nội dung testimonial bây giờ có hierarchy rõ: trích dẫn, rating, tên và vai trò. Điều này phù hợp hơn với guideline content site.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.id} className="flex h-full flex-col rounded-[28px] border border-[var(--ws-border)] bg-white p-6 shadow-[var(--ws-shadow-2)]">
              <div className="flex items-center justify-between">
                <span className="inline-flex rounded-full bg-[var(--ws-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--ws-primary-strong)]">
                  Rating {item.rating}/5
                </span>
                <Quote size={18} className="text-[var(--ws-ink-muted)]" />
              </div>

              <p className="mt-5 flex-1 text-base leading-7 text-[var(--ws-ink)]">“{item.text}”</p>

              <div className="mt-6 flex items-center gap-3 border-t border-[var(--ws-border)] pt-4">
                <img
                  src={item.avatar || PLACEHOLDER_AVATAR}
                  alt={item.name}
                  className="h-12 w-12 rounded-full border border-[var(--ws-border)] object-cover"
                />
                <div>
                  <p className="font-bold text-[var(--ws-ink)]">{item.name}</p>
                  <p className="text-sm text-[var(--ws-ink-soft)]">
                    {item.job} · {item.company}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
