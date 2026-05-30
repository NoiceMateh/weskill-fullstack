import { PLACEHOLDER_AVATAR } from "../assets/placeholders";

const mentors = [
  {
    name: "Nguyễn Minh Trí",
    title: "Head Mentor Full-stack",
    expertise: "React · Node.js · DevOps",
    description:
      "Hơn 12 năm kinh nghiệm phát triển hệ thống web, tập trung hướng dẫn học viên xây dựng sản phẩm theo chuẩn tuyển dụng.",
    achievements: ["Dẫn dắt 500+ học viên", "Triển khai 30+ dự án doanh nghiệp", "Chuyên gia tư vấn lộ trình nghề nghiệp"],
  },
  {
    name: "Trần Bảo An",
    title: "Mentor Data & AI",
    expertise: "Python · Data Analytics · Machine Learning",
    description:
      "Đồng hành cùng học viên từ nền tảng dữ liệu đến triển khai mô hình AI thực tế trong bài toán kinh doanh.",
    achievements: ["10+ dự án AI thực chiến", "Mentor nhóm Data Science", "Kinh nghiệm startup và tập đoàn"],
  },
  {
    name: "Lê Thùy Dung",
    title: "Mentor UX/UI",
    expertise: "Figma · Design System · Product UX",
    description:
      "Hướng dẫn học viên tư duy sản phẩm, xây dựng giao diện nhất quán và tối ưu trải nghiệm người dùng.",
    achievements: ["50+ sản phẩm đã thiết kế", "Xây dựng portfolio nghề nghiệp", "Định hướng nghề UX/UI"],
  },
  {
    name: "Phạm Văn Hùng",
    title: "Mentor DevOps",
    expertise: "Cloud · Kubernetes · CI/CD",
    description:
      "Giúp học viên làm chủ quy trình triển khai và vận hành hệ thống theo tiêu chuẩn doanh nghiệp hiện đại.",
    achievements: ["20+ hệ thống production", "Tối ưu pipeline CI/CD", "Tư vấn kiến trúc hạ tầng"],
  },
];

const supports = [
  {
    title: "Đồng hành 1:1",
    text: "Mentor theo sát tiến độ và phản hồi chi tiết trên từng bài tập, từng milestone dự án.",
  },
  {
    title: "Review theo chuẩn doanh nghiệp",
    text: "Sản phẩm học viên được đánh giá theo tiêu chí thực tế để sẵn sàng ứng tuyển.",
  },
  {
    title: "Định hướng nghề nghiệp",
    text: "Tư vấn lộ trình phát triển, tối ưu CV, portfolio và kỹ năng phỏng vấn kỹ thuật.",
  },
];

export default function Mentor() {
  return (
    <main className="min-h-screen bg-[var(--ws-page)] pt-24 text-[var(--ws-ink)]">
      <section className="bg-[linear-gradient(120deg,var(--ws-primary)_0%,var(--ws-primary-strong)_100%)] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Trang chủ / Giới thiệu / Đội ngũ mentor</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">Đội ngũ mentor WeSkill</h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            Mentor tại WeSkill là các chuyên gia thực chiến, trực tiếp dẫn dắt học viên qua dự án thật và lộ trình nghề nghiệp
            rõ ràng.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          {mentors.map((mentor) => (
            <article key={mentor.name} className="rounded-3xl border border-[var(--ws-border)] bg-white p-7 shadow-sm">
              <div className="flex items-start gap-4">
                <img
                  src={PLACEHOLDER_AVATAR}
                  alt={mentor.name}
                  className="h-14 w-14 rounded-2xl border border-[var(--ws-border)] bg-[var(--ws-page)] object-cover"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ws-primary-strong)]">{mentor.expertise}</p>
                  <h2 className="mt-1 text-xl font-bold text-[var(--ws-ink-strong)]">{mentor.name}</h2>
                  <p className="text-sm text-[var(--ws-muted)]">{mentor.title}</p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-[var(--ws-muted)]">{mentor.description}</p>

              <ul className="mt-5 space-y-2">
                {mentor.achievements.map((item) => (
                  <li key={item} className="rounded-xl bg-[var(--ws-primary-soft)] px-4 py-2.5 text-sm text-[var(--ws-ink)]">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-3xl border border-[var(--ws-border)] bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-3xl font-extrabold text-[var(--ws-ink-strong)]">Mentor không chỉ hướng dẫn, mà còn đồng hành</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {supports.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[var(--ws-border)] bg-[var(--ws-page)] p-5">
                <h3 className="text-lg font-bold text-[var(--ws-ink-strong)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ws-muted)]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
