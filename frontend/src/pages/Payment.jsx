import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { CreditCard, Landmark, QrCode } from "lucide-react";
import { getCourseById as getLocalCourseById } from "../data/coursesData";
import { getCourseById } from "../services/courseService";
import { createCardPayment, setupQrPayment } from "../services/paymentService";
import { adaptSampleCourse, formatLabels, formatVnd } from "../adapters/courseAdapter";
import { PLACEHOLDER_COURSE_IMAGE } from "../assets/placeholders";

const detectCardBrand = (cardNumber) => {
  const normalized = cardNumber.replace(/\D/g, "");
  if (normalized.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(normalized)) return "Mastercard";
  if (/^35/.test(normalized)) return "JCB";
  return "Card";
};

export default function Payment() {
  const { courseId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [checkout, setCheckout] = useState(location.state || null);
  const [channel, setChannel] = useState("card");
  const [cardForm, setCardForm] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [qrPayload, setQrPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(!location.state);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }

    let alive = true;
    async function restoreCheckout() {
      if (checkout) return;
      const stored = sessionStorage.getItem(`checkout:${courseId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (alive) setCheckout(parsed);
          return;
        } catch {
          sessionStorage.removeItem(`checkout:${courseId}`);
        }
      }

      try {
        const course = await getCourseById(courseId);
        if (alive) setCheckout({ course, enrollment: null });
      } catch {
        const fallback = getLocalCourseById(parseInt(courseId, 10));
        if (fallback && alive) setCheckout({ course: adaptSampleCourse(fallback), enrollment: null });
      } finally {
        if (alive) setIsLoading(false);
      }
    }

    restoreCheckout().finally(() => {
      if (alive) setIsLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [checkout, courseId, navigate]);

  const course = checkout?.course;
  const enrollment = checkout?.enrollment;
  const enrollmentId = enrollment?.id || enrollment?._id || searchParams.get("enrollmentId");
  const amount = Number(enrollment?.finalPrice || 0);
  const isSample = course?.source === "sample" || enrollment?.source === "sample";

  const cardLast4 = useMemo(() => cardForm.number.replace(/\D/g, "").slice(-4), [cardForm.number]);

  const handleGenerateQr = async () => {
    if (!enrollmentId || !amount) {
      setErrorMessage("Thiếu thông tin đăng ký. Vui lòng quay lại bước đăng ký.");
      return;
    }
    setIsProcessing(true);
    setErrorMessage("");
    setMessage("");
    try {
      if (isSample) {
        setQrPayload({
          qrCode: "",
          paymentRef: `sample-qr-${Date.now()}`,
          payment: { amount, status: "pending" },
        });
      } else {
        const result = await setupQrPayment({ enrollmentId });
        setQrPayload(result);
      }
      setMessage("Mã QR đã sẵn sàng. Sau khi thanh toán được xác nhận, khóa học sẽ được kích hoạt.");
    } catch (error) {
      setErrorMessage(error.message || "Không tạo được mã QR.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    const normalizedNumber = cardForm.number.replace(/\D/g, "");
    if (!enrollmentId || !amount) {
      setErrorMessage("Thiếu thông tin đăng ký. Vui lòng quay lại bước đăng ký.");
      return;
    }
    if (!cardForm.name.trim() || normalizedNumber.length < 12 || !cardForm.expiry.trim() || !cardForm.cvc.trim()) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin thẻ.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");
    setMessage("");
    try {
      const updatedCheckout = {
        ...checkout,
        enrollment: { ...enrollment, status: "active" },
      };

      if (!isSample) {
        const result = await createCardPayment({
          enrollmentId,
          cardToken: `tok_${Date.now()}`,
          cardLast4,
          cardBrand: detectCardBrand(cardForm.number),
        });
        updatedCheckout.enrollment = result.enrollment;
      }

      sessionStorage.setItem(`checkout:${course.id}`, JSON.stringify(updatedCheckout));
      setCheckout(updatedCheckout);
      setMessage("Thanh toán thẻ thành công. Khóa học đã được kích hoạt.");
    } catch (error) {
      setErrorMessage(error.message || "Thanh toán thẻ thất bại.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--ws-muted)]">Đang tải thông tin thanh toán...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-[var(--ws-ink)]">Không tìm thấy khóa học</h1>
          <button onClick={() => navigate("/courses")} className="rounded-lg bg-[var(--ws-primary)] px-6 py-3 text-white">
            Quay lại khóa học
          </button>
        </div>
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-[var(--ws-ink)]">Chưa có thông tin đăng ký</h1>
          <button onClick={() => navigate(`/register/${courseId}`)} className="rounded-lg bg-[var(--ws-primary)] px-6 py-3 text-white">
            Quay lại đăng ký
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--ws-page)] pt-24">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--ws-ink-strong)]">Thanh toán</h1>
          <p className="mt-2 text-sm text-[var(--ws-muted)]">Chọn kênh thanh toán để hoàn tất đăng ký khóa học.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-6">
            <div className="rounded-2xl border border-[var(--ws-border)] bg-white p-6">
              <h2 className="mb-4 text-xl font-bold text-[var(--ws-ink)]">Tóm tắt đơn hàng</h2>
              <div className="flex gap-4">
                <img src={course.thumbnailUrl || PLACEHOLDER_COURSE_IMAGE} alt={course.name} className="h-20 w-20 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-[var(--ws-ink)]">{course.name}</h3>
                  <p className="mt-1 text-sm text-[var(--ws-muted)]">{course.instructor}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3 border-t border-[var(--ws-border)] pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--ws-muted)]">Hình thức học</span>
                  <span className="font-semibold text-[var(--ws-ink)]">{formatLabels[enrollment?.formatType] || enrollment?.formatType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--ws-muted)]">Phương án học phí</span>
                  <span className="font-semibold text-[var(--ws-ink)]">{enrollment?.paymentModel === "installment" ? "Trả góp 6 tháng" : "Thanh toán toàn bộ"}</span>
                </div>
                {enrollment?.monthlyPrice && (
                  <div className="flex justify-between">
                    <span className="text-[var(--ws-muted)]">Dự kiến mỗi tháng</span>
                    <span className="font-semibold text-[var(--ws-ink)]">{formatVnd(enrollment.monthlyPrice)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-[var(--ws-border)] pt-3 text-lg font-bold text-[var(--ws-primary-strong)]">
                  <span>Tổng thanh toán</span>
                  <span>{formatVnd(amount)}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--ws-border)] bg-white p-6">
            <h2 className="mb-4 text-xl font-bold text-[var(--ws-ink)]">Kênh thanh toán</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setChannel("card")}
                className={`rounded-xl border-2 p-4 text-left ${channel === "card" ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)]" : "border-[var(--ws-border)]"}`}
              >
                <CreditCard className="mb-2 text-[var(--ws-primary)]" size={22} />
                <p className="font-semibold text-[var(--ws-ink)]">Thẻ thanh toán</p>
                <p className="mt-1 text-sm text-[var(--ws-muted)]">Liên kết thẻ mô phỏng và kích hoạt khóa học ngay.</p>
              </button>
              <button
                type="button"
                onClick={() => setChannel("bank")}
                className={`rounded-xl border-2 p-4 text-left ${channel === "bank" ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)]" : "border-[var(--ws-border)]"}`}
              >
                <Landmark className="mb-2 text-[var(--ws-primary)]" size={22} />
                <p className="font-semibold text-[var(--ws-ink)]">Ngân hàng / QR</p>
                <p className="mt-1 text-sm text-[var(--ws-muted)]">Sinh mã QR để học viên chuyển khoản.</p>
              </button>
            </div>

            {errorMessage && <p className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}
            {message && <p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}

            {channel === "card" ? (
              <div className="mt-6 space-y-3">
                <input value={cardForm.name} onChange={(e) => setCardForm((s) => ({ ...s, name: e.target.value }))} placeholder="Tên trên thẻ" className="w-full rounded-xl border border-[var(--ws-border)] px-4 py-3 text-sm" />
                <input value={cardForm.number} onChange={(e) => setCardForm((s) => ({ ...s, number: e.target.value }))} placeholder="Số thẻ" className="w-full rounded-xl border border-[var(--ws-border)] px-4 py-3 text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={cardForm.expiry} onChange={(e) => setCardForm((s) => ({ ...s, expiry: e.target.value }))} placeholder="MM/YY" className="rounded-xl border border-[var(--ws-border)] px-4 py-3 text-sm" />
                  <input value={cardForm.cvc} onChange={(e) => setCardForm((s) => ({ ...s, cvc: e.target.value }))} placeholder="CVC" className="rounded-xl border border-[var(--ws-border)] px-4 py-3 text-sm" />
                </div>
                <button onClick={handleCardPayment} disabled={isProcessing} className="w-full rounded-xl bg-[var(--ws-primary)] py-4 text-lg font-bold text-white disabled:opacity-60">
                  {isProcessing ? "Đang xử lý..." : `Thanh toán ${formatVnd(amount)}`}
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <button onClick={handleGenerateQr} disabled={isProcessing} className="w-full rounded-xl bg-[var(--ws-primary)] py-4 text-lg font-bold text-white disabled:opacity-60">
                  {isProcessing ? "Đang tạo mã QR..." : "Tạo mã QR thanh toán"}
                </button>
                {qrPayload && (
                  <div className="mt-5 rounded-2xl border border-[var(--ws-border)] bg-[var(--ws-page)] p-5 text-center">
                    {qrPayload.qrCode ? (
                      <img src={qrPayload.qrCode} alt="Mã QR thanh toán" className="mx-auto h-56 w-56 rounded-xl bg-white p-3" />
                    ) : (
                      <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-xl bg-white text-[var(--ws-primary)]">
                        <QrCode size={120} />
                      </div>
                    )}
                    <p className="mt-4 text-sm text-[var(--ws-muted)]">Nội dung chuyển khoản</p>
                    <p className="mt-1 font-bold text-[var(--ws-ink)]">{qrPayload.paymentRef}</p>
                    <p className="mt-2 text-lg font-bold text-[var(--ws-primary-strong)]">{formatVnd(qrPayload.payment?.amount || amount)}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
