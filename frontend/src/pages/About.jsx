export default function About() {
  const solutions = [
    {
      title: "Giải pháp cho doanh nghiệp",
      description:
        "Đào tạo đội ngũ nội bộ theo hướng thực chiến: sản xuất nội dung số, vận hành truyền thông đa nền tảng và chuẩn hóa quy trình triển khai.",
      bullets: [
        "Tối ưu chi phí sản xuất nội dung và video marketing.",
        "Rút ngắn thời gian đào tạo nhờ lộ trình theo năng lực.",
        "Nâng cao hiệu suất truyền thông và bán hàng của đội nhóm.",
      ],
    },
    {
      title: "Giải pháp cho cá nhân",
      description:
        "Hỗ trợ học viên xây dựng kỹ năng công nghệ theo dự án thực tế, có mentor theo sát và định hướng nghề nghiệp rõ ràng.",
      bullets: [
        "Có lộ trình học tập rõ ràng, phù hợp mục tiêu nghề nghiệp.",
        "Xây dựng portfolio thật để sẵn sàng ứng tuyển.",
        "Được hỗ trợ CV, phỏng vấn và kết nối việc làm.",
      ],
    },
  ];

  const philosophy = [
    {
      title: "TÂM",
      text: "Đặt học viên ở trung tâm, ưu tiên chất lượng đào tạo và kết quả thực tế.",
    },
    {
      title: "TRÍ",
      text: "Liên tục cập nhật kiến thức công nghệ để nội dung luôn mới, đúng xu hướng thị trường.",
    },
    {
      title: "KIÊN",
      text: "Kiên định với định hướng đào tạo thực chiến, đồng hành đến khi học viên đạt mục tiêu.",
    },
    {
      title: "TRUNG",
      text: "Minh bạch trong cam kết, trách nhiệm trong từng trải nghiệm học tập của học viên.",
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--ws-page)] pt-24 text-[var(--ws-ink)]">
      <section className="bg-[linear-gradient(120deg,var(--ws-primary)_0%,var(--ws-primary-strong)_100%)] py-20 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/80">Trang chủ / Giới thiệu / Tổng quan</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">Về WeSkill</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            WeSkill xây dựng hệ sinh thái đào tạo công nghệ thực chiến, kết nối giữa kỹ năng nghề nghiệp, mentor và cơ hội
            việc làm cho học viên.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-3xl border border-[var(--ws-border)] bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-primary-strong)]">Công ty TNHH WeSkill</p>
          <h2 className="mt-3 text-3xl font-extrabold text-[var(--ws-ink-strong)]">Đào tạo kỹ năng số cho học viên và doanh nghiệp</h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--ws-muted)]">
            Chúng tôi tập trung vào chương trình học có tính ứng dụng cao, giúp người học nắm chắc nền tảng và triển khai
            được sản phẩm thực tế. Mỗi khóa học đều được thiết kế theo lộ trình rõ ràng, có đầu ra kỹ năng cụ thể.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-14 lg:grid-cols-2">
        {solutions.map((item) => (
          <article key={item.title} className="rounded-3xl border border-[var(--ws-border)] bg-white p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-[var(--ws-ink-strong)]">{item.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--ws-muted)]">{item.description}</p>
            <ul className="mt-6 space-y-3">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="rounded-xl bg-[var(--ws-primary-soft)] px-4 py-3 text-sm text-[var(--ws-ink)]">
                  {bullet}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="bg-[linear-gradient(120deg,var(--ws-ink-strong)_0%,var(--ws-ink)_100%)] py-16 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-extrabold">Tầm nhìn phát triển</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">Giai đoạn 2026 - 2028</p>
              <p className="mt-3 text-sm leading-relaxed text-white/90">
                Mở rộng chương trình học công nghệ theo chuẩn nghề nghiệp, tăng cường nội dung dự án thực tế và hệ thống
                đánh giá năng lực đầu ra.
              </p>
            </article>
            <article className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">Giai đoạn 2028 - 2030</p>
              <p className="mt-3 text-sm leading-relaxed text-white/90">
                Trở thành đơn vị đào tạo kỹ năng số hàng đầu, kết nối sâu với doanh nghiệp để nâng cao cơ hội việc làm cho
                học viên sau tốt nghiệp.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-extrabold text-[var(--ws-ink-strong)]">Triết lý hoạt động</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {philosophy.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[var(--ws-border)] bg-white p-5 shadow-sm">
              <p className="text-lg font-extrabold text-[var(--ws-primary-strong)]">{item.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ws-muted)]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
