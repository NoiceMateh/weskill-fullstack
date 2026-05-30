import { PARTNER_LOGOS } from "../assets/placeholders";

function TrustBar() {
  return (
    <section className="py-12">
      <div className="ws-section">
        <div className="rounded-[32px] border border-[var(--ws-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(237,247,232,0.92)_100%)] p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-primary-strong)]">Trusted by learners</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-[var(--ws-ink)]">Học viên đang làm việc tại các doanh nghiệp công nghệ và sản phẩm số.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--ws-ink-soft)]">
              Hơn 10.000 học viên đã đăng ký khóa học tại WeSkill, trong đó có nhiều học viên đang làm việc tại các công ty công nghệ hàng đầu Việt Nam.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PARTNER_LOGOS.map((company) => (
              <div key={company.id} className="flex h-20 items-center justify-center rounded-[22px] border border-white bg-white px-3 shadow-[var(--ws-shadow-2)]">
                <img src={company.image} alt={company.name} className="h-10 w-auto object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustBar;
