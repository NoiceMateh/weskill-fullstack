import { useState } from "react";
import { BUSINESS_PARTNER_IMAGES, PLACEHOLDER_COURSE_IMAGE } from "../assets/placeholders";

export default function Business() {
  const [activeTab, setActiveTab] = useState("partners");

  const partners = [
    {
      id: "fpt",
      name: "FPT Software",
      description: "Công ty công nghệ hàng đầu Việt Nam",
      partnershipYear: 2022,
      employeesTrained: 150,
      successRate: 95,
    },
    {
      id: "vng",
      name: "VNG Corporation",
      description: "Tập đoàn công nghệ giải trí hàng đầu",
      partnershipYear: 2023,
      employeesTrained: 89,
      successRate: 92,
    },
    {
      id: "techcombank",
      name: "Techcombank",
      description: "Ngân hàng số tại Việt Nam",
      partnershipYear: 2021,
      employeesTrained: 200,
      successRate: 98,
    },
  ];

  const stories = [
    {
      company: "FPT Software",
      title: "Chuyển đổi đội ngũ phát triển",
      summary: "Đào tạo bổ sung kỹ năng fullstack cho nhân sự nội bộ và rút ngắn thời gian lên dự án.",
      metrics: ["+45% năng suất", "95% giữ chân", "12 dự án"],
    },
    {
      company: "Techcombank",
      title: "Nâng cấp đội ngũ data",
      summary: "Xây dựng lộ trình data analyst và AI app cho khối vận hành.",
      metrics: ["8 sản phẩm", "+60% hiệu quả", "4.8/5 hài lòng"],
    },
  ];

  const benefits = [
    "Đào tạo theo nhu cầu thực tế của doanh nghiệp",
    "Báo cáo tiến độ và hiệu quả chi tiết",
    "Mentor đồng hành trực tiếp",
    "Linh hoạt online, offline, hybrid",
    "ập nhật công nghệ liên tục",
    "ối ưu chi phí đào tạo",
  ];

  return (
    <main className="min-h-screen bg-[var(--ws-page)] pt-24">
      <section className="bg-gradient-to-br from-[var(--ws-primary)] to-[var(--ws-primary-strong)] py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-extrabold md:text-5xl">Hợp tác doanh nghiệp</h1>
          <p className="mx-auto mt-4 max-w-3xl text-white/90">
            WeSkill đồng hành cùng doanh nghiệp để nâng cấp kỹ năng đội ngũ, tối ưu vận hành và tăng tốc chuyển đổi số.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-left md:grid-cols-4">
            <div className="rounded-lg bg-white/15 p-4">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-sm text-white/90">Nhân sự đã đào tạo</p>
            </div>
            <div className="rounded-lg bg-white/15 p-4">
              <p className="text-2xl font-bold">95%</p>
              <p className="text-sm text-white/90">Hài lòng</p>
            </div>
            <div className="rounded-lg bg-white/15 p-4">
              <p className="text-2xl font-bold">40+</p>
              <p className="text-sm text-white/90">Đối tác</p>
            </div>
            <div className="rounded-lg bg-white/15 p-4">
              <p className="text-2xl font-bold">85%</p>
              <p className="text-sm text-white/90">Chuyển đổi thành công</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--ws-border)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-2 px-4 py-4">
          {[
            { id: "partners", label: "Đối tác" },
            { id: "success", label: "Thành tựu" },
            { id: "benefits", label: "Lợi ích" },
            { id: "contact", label: "Liên hệ" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold ${
                activeTab === tab.id
                  ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)] text-[var(--ws-primary-strong)]"
                  : "border-[var(--ws-border)] bg-white text-[var(--ws-muted)] hover:bg-[var(--ws-page)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "partners" && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {partners.map((partner) => (
              <article key={partner.name} className="rounded-xl border border-[var(--ws-border)] bg-white p-5">
                <img
                  src={BUSINESS_PARTNER_IMAGES[partner.id] || PLACEHOLDER_COURSE_IMAGE}
                  alt={partner.name}
                  className="h-32 w-full rounded-lg object-cover"
                />
                <h3 className="mt-4 text-lg font-bold text-[var(--ws-ink)]">{partner.name}</h3>
                <p className="mt-1 text-sm text-[var(--ws-muted)]">{partner.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <p className="font-bold text-[var(--ws-primary-strong)]">{partner.partnershipYear}</p>
                    <p className="text-[var(--ws-muted)]">Năm</p>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--ws-primary-strong)]">{partner.employeesTrained}</p>
                    <p className="text-[var(--ws-muted)]">Nhân sự</p>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--ws-primary-strong)]">{partner.successRate}%</p>
                    <p className="text-[var(--ws-muted)]">Thành công</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === "success" && (
        <section className="mx-auto max-w-6xl space-y-5 px-4 py-10">
          {stories.map((story) => (
            <article key={story.company} className="rounded-xl border border-[var(--ws-border)] bg-white p-6">
              <h3 className="text-xl font-bold text-[var(--ws-ink)]">{story.company}</h3>
              <p className="mt-1 text-sm font-semibold text-[var(--ws-primary-strong)]">{story.title}</p>
              <p className="mt-3 text-sm text-[var(--ws-muted)]">{story.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {story.metrics.map((metric) => (
                  <span key={metric} className="rounded-full border border-[var(--ws-border)] px-3 py-1 text-xs text-[var(--ws-ink)]">
                    {metric}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === "benefits" && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <div key={item} className="rounded-xl border border-[var(--ws-border)] bg-white p-5 text-sm text-[var(--ws-ink)]">
                {item}
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === "contact" && (
        <section className="mx-auto max-w-5xl px-4 py-10">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[var(--ws-border)] bg-white p-6">
              <h3 className="text-lg font-bold text-[var(--ws-ink)]">Thông tin liên hệ</h3>
              <div className="mt-4 space-y-3 text-sm text-[var(--ws-muted)]">
                <p>Email: business@weskill.vn</p>
                <p>Hotline: (028) 1234-5678</p>
                <p>Dia chi: 123 Đường ABC, Quận 1, TP.HCM</p>
                <p>Gio lam viec: T2-T6, 8:00-18:00</p>
              </div>
            </div>

            <form className="rounded-xl border border-[var(--ws-border)] bg-white p-6">
              <h3 className="text-lg font-bold text-[var(--ws-ink)]">Gửi yêu cầu</h3>
              <div className="mt-4 space-y-3">
                <input className="w-full rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm" placeholder="Tên công ty" />
                <input className="w-full rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm" placeholder="Ho ten Liên hệ" />
                <input className="w-full rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm" placeholder="Email" />
                <input className="w-full rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm" placeholder="Số điện thoại" />
                <textarea className="w-full rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm" rows={4} placeholder="Nhu cầu đào tạo" />
                <button type="submit" className="w-full rounded-lg bg-[var(--ws-primary)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--ws-primary-strong)]">
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </main>
  );
}

