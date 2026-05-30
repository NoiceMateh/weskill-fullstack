import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById as getLocalCourseById } from "../data/coursesData";
import { getCourseById } from "../services/courseService";
import { createEnrollment } from "../services/enrollmentService";
import { adaptSampleCourse, formatLabels, formatVnd, getFormatAmount } from "../adapters/courseAdapter";
import { PLACEHOLDER_COURSE_IMAGE } from "../assets/placeholders";

const paymentModels = [
  { id: "upfront", label: "Thanh toán toàn bộ", desc: "Hoàn tất học phí trong một lần thanh toán." },
  { id: "installment", label: "Trả góp 6 tháng", desc: "Chia học phí thành 6 kỳ thanh toán mô phỏng." },
];

export default function CourseRegistration() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("upfront");

  useEffect(() => {
    let isMounted = true;

    async function loadCourse() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const data = await getCourseById(courseId);
        if (isMounted) setCourse(data);
      } catch (error) {
        const fallback = getLocalCourseById(parseInt(courseId, 10));
        if (fallback && isMounted) {
          setCourse(adaptSampleCourse(fallback));
        } else if (isMounted) {
          setErrorMessage(error.message || "Không tìm thấy khóa học.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCourse();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  useEffect(() => {
    if (!course) return;
    const firstAvailable = Object.entries(course.learningMethods || {}).find(([, method]) => method.available)?.[0] || "online";
    setSelectedFormat(firstAvailable);
  }, [course]);

  const selectedAmount = useMemo(() => getFormatAmount(course, selectedFormat), [course, selectedFormat]);
  const monthlyAmount = selectedPayment === "installment" ? Math.ceil(selectedAmount / 6) : null;

  const handleContinueToPayment = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      localStorage.setItem("redirectAfterLogin", `/register/${courseId}`);
      navigate("/login");
      return;
    }

    if (!selectedFormat || !selectedPayment) {
      setErrorMessage("Vui lòng chọn hình thức học và phương án thanh toán.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      let enrollment;
      if (course.source === "sample") {
        enrollment = {
          id: `sample-enrollment-${course.id}-${Date.now()}`,
          courseId: course.id,
          formatType: selectedFormat,
          paymentModel: selectedPayment,
          finalPrice: selectedAmount,
          monthlyPrice: monthlyAmount,
          status: "pending_payment",
          source: "sample",
        };
      } else {
        enrollment = await createEnrollment({
          courseId: course.id,
          formatType: selectedFormat,
          paymentModel: selectedPayment,
        });
      }

      const checkout = { course, enrollment };
      sessionStorage.setItem(`checkout:${course.id}`, JSON.stringify(checkout));
      navigate(`/payment/${course.id}?enrollmentId=${enrollment.id || enrollment._id}`, { state: checkout });
    } catch (error) {
      setErrorMessage(error.message || "Không tạo được đăng ký khóa học.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--ws-muted)]">Đang tải thông tin khóa học...</p>
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

  return (
    <main className="min-h-screen bg-[var(--ws-page)] pt-24">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--ws-ink-strong)]">Đăng ký khóa học</h1>
          <p className="mt-2 text-sm text-[var(--ws-muted)]">Chọn hình thức học và phương án học phí để tiếp tục thanh toán.</p>
        </div>

        {errorMessage && <p className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p>}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
          <section className="rounded-2xl border border-[var(--ws-border)] bg-white p-6">
            <img src={course.thumbnailUrl || PLACEHOLDER_COURSE_IMAGE} alt={course.name} className="h-56 w-full rounded-xl object-cover" />
            <h2 className="mt-5 text-2xl font-bold text-[var(--ws-ink)]">{course.name}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ws-muted)]">{course.desc}</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-[var(--ws-page)] p-3">
                <p className="text-[var(--ws-muted)]">Thời lượng</p>
                <p className="mt-1 font-semibold text-[var(--ws-ink)]">{course.duration}</p>
              </div>
              <div className="rounded-xl bg-[var(--ws-page)] p-3">
                <p className="text-[var(--ws-muted)]">Giảng viên</p>
                <p className="mt-1 font-semibold text-[var(--ws-ink)]">{course.instructor}</p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border border-[var(--ws-border)] bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-[var(--ws-ink)]">Hình thức học</h3>
              <div className="space-y-3">
                {Object.entries(course.learningMethods || {}).map(([key, method]) => {
                  if (!method.available) return null;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedFormat(key)}
                      className={`w-full rounded-xl border-2 p-4 text-left transition ${
                        selectedFormat === key ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)]" : "border-[var(--ws-border)] hover:border-[var(--ws-primary)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[var(--ws-ink)]">{formatLabels[key] || key}</p>
                          <p className="text-sm text-[var(--ws-muted)]">{method.sessionCount ? `${method.sessionCount} buổi học` : method.location || "Linh hoạt theo lộ trình"}</p>
                        </div>
                        <p className="font-bold text-[var(--ws-primary-strong)]">{method.price}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--ws-border)] bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-[var(--ws-ink)]">Phương án học phí</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {paymentModels.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedPayment(option.id)}
                    className={`rounded-xl border-2 p-4 text-left ${
                      selectedPayment === option.id ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)]" : "border-[var(--ws-border)]"
                    }`}
                  >
                    <p className="font-semibold text-[var(--ws-ink)]">{option.label}</p>
                    <p className="mt-1 text-sm text-[var(--ws-muted)]">{option.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--ws-border)] bg-white p-6">
              <div className="flex justify-between text-sm text-[var(--ws-muted)]">
                <span>Học phí</span>
                <span className="font-semibold text-[var(--ws-ink)]">{formatVnd(selectedAmount)}</span>
              </div>
              {monthlyAmount && (
                <div className="mt-2 flex justify-between text-sm text-[var(--ws-muted)]">
                  <span>Dự kiến mỗi tháng</span>
                  <span className="font-semibold text-[var(--ws-ink)]">{formatVnd(monthlyAmount)}</span>
                </div>
              )}
              <div className="mt-4 flex justify-between border-t border-[var(--ws-border)] pt-4 text-lg font-bold text-[var(--ws-primary-strong)]">
                <span>Tổng thanh toán</span>
                <span>{formatVnd(selectedAmount)}</span>
              </div>
              <button
                type="button"
                onClick={handleContinueToPayment}
                disabled={isSubmitting}
                className="mt-5 w-full rounded-xl bg-[var(--ws-primary)] py-4 text-lg font-bold text-white hover:bg-[var(--ws-primary-strong)] disabled:opacity-60"
              >
                {isSubmitting ? "Đang tạo đăng ký..." : "Tiếp tục thanh toán"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
