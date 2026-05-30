import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { coursesData, getCourseById as getLocalCourseById } from "../data/coursesData";
import { getTrackConfig } from "../constants/tracks";
import SkillBadges from "../components/SkillBadges";
import { getCourseById } from "../services/courseService";
import { createCourseReview, getCourseReviews } from "../services/reviewService";
import { PLACEHOLDER_COURSE_IMAGE } from "../assets/placeholders";
import { adaptSampleCourse, formatShortLabels } from "../adapters/courseAdapter";

const tabs = [
  { id: "overview", label: "Tổng quan" },
  { id: "curriculum", label: "Lộ trình" },
  { id: "instructor", label: "Giảng viên" },
  { id: "reviews", label: "Đánh giá" },
];

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFormat, setSelectedFormat] = useState("online");

  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewForm, setReviewForm] = useState({ authorName: "", rating: 5, comment: "" });

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      setIsLoading(true);
      try {
        const data = await getCourseById(courseId);
        if (!isMounted) return;
        setCourse(data);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) return;
        const fallback = getLocalCourseById(parseInt(courseId, 10));
        if (fallback) {
          setCourse(adaptSampleCourse(fallback));
          setErrorMessage("");
        } else {
          setCourse(null);
          setErrorMessage(error.message || "Không tìm thấy khóa học.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCourse();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  useEffect(() => {
    if (!course) return;
    const firstAvailableFormat = Object.entries(course.learningMethods || {}).find(([, method]) => method.available)?.[0];
    if (firstAvailableFormat) {
      setSelectedFormat(firstAvailableFormat);
    }
  }, [course]);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      setReviewLoading(true);
      setReviewError("");
      try {
        const data = await getCourseReviews(courseId);
        if (!isMounted) return;
        setReviews(data);
      } catch (error) {
        if (!isMounted) return;
        setReviewError(error.message || "Không tải được đánh giá.");
      } finally {
        if (isMounted) setReviewLoading(false);
      }
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const trackConfig = useMemo(() => getTrackConfig(course?.track), [course]);
  const relatedCourses = useMemo(
    () => coursesData.map(adaptSampleCourse).filter((c) => c.track === course?.track && c.id !== course?.id).slice(0, 3),
    [course]
  );

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewError("");

    if (!reviewForm.comment.trim()) {
      setReviewError("Nội dung bình luận không được để trống.");
      return;
    }

    try {
      const created = await createCourseReview(courseId, {
        authorName: reviewForm.authorName || "Học viên",
        rating: Number(reviewForm.rating) || 5,
        comment: reviewForm.comment,
      });
      setReviews((prev) => [created, ...prev]);
      setReviewForm({ authorName: reviewForm.authorName, rating: 5, comment: "" });
    } catch (error) {
      setReviewError(error.message || "Không gửi được đánh giá.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-[var(--ws-muted)]">Đang tải chi tiết khóa học...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-[var(--ws-ink)]">Không tìm thấy khóa học</h1>
          <button
            onClick={() => navigate("/courses")}
            className="rounded-lg bg-[var(--ws-primary)] px-6 py-3 text-white hover:bg-[var(--ws-primary-strong)]"
          >
            Quay lại khóa học
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-24">
      {errorMessage && (
        <div className="mx-auto mt-4 max-w-6xl px-4">
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{errorMessage}</div>
        </div>
      )}

      <section className="relative overflow-hidden px-4 py-14">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F9FBFE] to-[#F0F8EC]" />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-7 lg:grid-cols-[2fr_1fr]">
          <div>
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: trackConfig?.color || "#6BBC44" }}
            >
              {trackConfig?.name || "Chương trình"}
            </span>
            <h1 className="mt-4 text-4xl font-bold text-[var(--ws-ink)]">{course.name}</h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--ws-muted)]">{course.fullDesc}</p>

            <div className="mt-5 flex gap-8 text-sm text-[var(--ws-muted)]">
              <div>
                <p className="text-xl font-bold text-[var(--ws-ink)]">{course.rating}</p>
                <p>Đánh giá</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--ws-primary-strong)]">{course.jobPlacementRate}%</p>
                <p>Tỷ lệ việc làm</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--ws-ink)]">{course.duration}</p>
                <p>Thời lượng</p>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-[var(--ws-ink)]">Kỹ năng chính</p>
              <SkillBadges skillAreas={course.skillAreas} />
            </div>
          </div>

          <aside className="rounded-2xl border border-[var(--ws-border)] bg-white p-6 shadow-sm">
            <img
              src={course.thumbnailUrl || PLACEHOLDER_COURSE_IMAGE}
              alt={course.name}
              className="h-40 w-full rounded-xl object-cover"
            />
            <div className="mt-4 rounded-lg bg-[var(--ws-primary-soft)] p-3 text-center">
              <p className="text-xl font-bold text-[var(--ws-primary-strong)]">
                {selectedFormat && course.learningMethods[selectedFormat]?.price}
              </p>
              <p className="text-xs text-[var(--ws-muted)]">Giá theo hình thức học đã chọn</p>
            </div>
            <div className="mt-4 grid gap-2">
              <button
                onClick={() => {
                  const user = localStorage.getItem("user");
                  if (user) {
                    navigate(`/register/${courseId}`);
                  } else {
                    localStorage.setItem("redirectAfterLogin", window.location.pathname);
                    navigate("/login");
                  }
                }}
                className="rounded-lg bg-[var(--ws-primary)] py-2.5 text-sm font-semibold text-white hover:bg-[var(--ws-primary-strong)]"
              >
                Đăng ký ngay
              </button>
            </div>
          </aside>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <section>
            <div className="mb-6 flex flex-wrap gap-2 border-b border-[var(--ws-border)] pb-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    activeTab === tab.id
                      ? "bg-[var(--ws-primary-soft)] text-[var(--ws-primary-strong)]"
                      : "text-[var(--ws-muted)] hover:bg-[var(--ws-page)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--ws-ink)]">Về khóa học</h3>
                  <p className="mt-2 text-[var(--ws-muted)]">{course.fullDesc}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-[var(--ws-ink)]">Bạn sẽ nhận được</h3>
                  <ul className="mt-3 space-y-2">
                    {course.includes.map((item, idx) => (
                      <li key={idx} className="rounded-lg border border-[var(--ws-border)] bg-white px-3 py-2 text-sm text-[var(--ws-muted)]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div>
                <h3 className="mb-5 text-2xl font-bold text-[var(--ws-ink)]">Lộ trình học</h3>
                <div className="space-y-3">
                  {course.curriculum.map((item, idx) => (
                    <div key={idx} className="flex gap-3 rounded-lg border border-[var(--ws-border)] bg-white p-3">
                      <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ws-primary)] text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <p className="text-sm text-[var(--ws-ink)]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="rounded-xl border border-[var(--ws-border)] bg-white p-5">
                <h3 className="text-2xl font-bold text-[var(--ws-ink)]">Giảng viên</h3>
                <p className="mt-3 text-lg font-semibold text-[var(--ws-ink)]">{course.instructor}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ws-muted)]">
                  Giảng viên có kinh nghiệm thực chiến, đồng hành xuyên suốt trong quá trình học và dự án.
                </p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div>
                <h3 className="mb-4 text-2xl font-bold text-[var(--ws-ink)]">Đánh giá và bình luận</h3>

                <form onSubmit={submitReview} className="mb-5 rounded-xl border border-[var(--ws-border)] bg-white p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={reviewForm.authorName}
                      onChange={(e) => setReviewForm((s) => ({ ...s, authorName: e.target.value }))}
                      placeholder="Tên của bạn"
                      className="rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm focus:border-[var(--ws-primary)] focus:outline-none"
                    />
                    <select
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm((s) => ({ ...s, rating: Number(e.target.value) }))}
                      className="rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm focus:border-[var(--ws-primary)] focus:outline-none"
                    >
                      <option value={5}>5 sao</option>
                      <option value={4}>4 sao</option>
                      <option value={3}>3 sao</option>
                      <option value={2}>2 sao</option>
                      <option value={1}>1 sao</option>
                    </select>
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((s) => ({ ...s, comment: e.target.value }))}
                    rows={3}
                    placeholder="Viết nhận xét của bạn"
                    className="mt-3 w-full rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm focus:border-[var(--ws-primary)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="mt-3 rounded-lg bg-[var(--ws-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--ws-primary-strong)]"
                  >
                    Gửi đánh giá
                  </button>
                </form>

                {reviewError && <p className="mb-3 text-sm text-red-600">{reviewError}</p>}
                {reviewLoading ? (
                  <p className="text-sm text-[var(--ws-muted)]">Đang tải đánh giá...</p>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <article key={review.id} className="rounded-xl border border-[var(--ws-border)] bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[var(--ws-ink)]">{review.authorName}</p>
                            {review.createdAt && (
                              <p className="text-xs text-[var(--ws-muted)]">
                                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                              </p>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-[var(--ws-primary-strong)]">{review.rating}/5</p>
                        </div>
                        <p className="mt-2 text-sm text-[var(--ws-muted)]">{review.comment}</p>
                      </article>
                    ))}
                    {reviews.length === 0 && <p className="text-sm text-[var(--ws-muted)]">Chưa có bình luận nào.</p>}
                  </div>
                )}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="rounded-xl border border-[var(--ws-border)] bg-white p-5">
              <h3 className="mb-3 text-lg font-bold text-[var(--ws-ink)]">Định dạng học tập</h3>
              <div className="space-y-2">
                {Object.entries(course.learningMethods).map(([key, method]) => {
                  if (!method.available) return null;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedFormat(key)}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                        selectedFormat === key
                          ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)]"
                          : "border-[var(--ws-border)]"
                      }`}
                    >
                      <p className="font-semibold text-[var(--ws-ink)]">{formatShortLabels[key] || key}</p>
                      <p className="text-xs text-[var(--ws-muted)]">{method.price}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-[var(--ws-border)] bg-white p-5">
              <h3 className="mb-3 text-lg font-bold text-[var(--ws-ink)]">Tóm tắt</h3>
              <div className="space-y-2 text-sm text-[var(--ws-muted)]">
                <div className="flex justify-between">
                  <span>Thời lượng</span>
                  <span className="font-semibold text-[var(--ws-ink)]">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sĩ số</span>
                  <span className="font-semibold text-[var(--ws-ink)]">{course.classSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lịch học</span>
                  <span className="font-semibold text-[var(--ws-ink)]">{course.schedule}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {relatedCourses.length > 0 && (
          <section className="mt-14 border-t border-[var(--ws-border)] pt-10">
            <h3 className="mb-6 text-2xl font-bold text-[var(--ws-ink)]">Khóa học liên quan</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedCourses.map((relCourse) => (
                <button
                  key={relCourse.id}
                  onClick={() => navigate(`/course/${relCourse.id}`)}
                  className="overflow-hidden rounded-xl border border-[var(--ws-border)] bg-white text-left"
                >
                  <img src={relCourse.thumbnailUrl || PLACEHOLDER_COURSE_IMAGE} alt={relCourse.name} className="h-28 w-full object-cover" />
                  <div className="p-3">
                    <p className="font-semibold text-[var(--ws-ink)]">{relCourse.name}</p>
                    <p className="mt-1 text-sm text-[var(--ws-muted)]">{relCourse.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
