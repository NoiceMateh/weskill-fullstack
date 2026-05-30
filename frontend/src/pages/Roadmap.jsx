import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpenCheck, ChevronRight, Clock, GraduationCap } from "lucide-react";
import { PLACEHOLDER_COURSE_IMAGE } from "../assets/placeholders";
import { getMyLearningCourses } from "../services/learningService";

const getProgressColor = (progress) => {
  if (progress >= 80) return "bg-emerald-500";
  if (progress >= 60) return "bg-sky-500";
  if (progress >= 40) return "bg-amber-500";
  return "bg-rose-500";
};

const getProgressText = (progress) => {
  if (progress >= 80) return "Xuất sắc";
  if (progress >= 60) return "Tốt";
  if (progress >= 40) return "Đang tiến bộ";
  return "Mới bắt đầu";
};

export default function Roadmap() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!user || !user.isLoggedIn) {
      navigate("/login");
    }
  }, [navigate, user]);

  useEffect(() => {
    if (!user?.isLoggedIn) return;
    let alive = true;

    async function loadLearning() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const data = await getMyLearningCourses();
        if (alive) setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        if (alive) setErrorMessage(error.message || "Không tải được danh sách khóa học.");
      } finally {
        if (alive) setIsLoading(false);
      }
    }

    loadLearning();
    return () => {
      alive = false;
    };
  }, [user]);

  const averageProgress = courses.length
    ? Math.round(courses.reduce((sum, item) => sum + (item.roadmap?.progressPercent || 0), 0) / courses.length)
    : 0;
  const totalLessons = courses.reduce((sum, item) => sum + (item.roadmap?.totalLessons || 0), 0);
  const completedLessons = courses.reduce((sum, item) => sum + (item.roadmap?.completedLessons || 0), 0);

  if (!user || !user.isLoggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--ws-page)] pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--ws-primary)]"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--ws-page)] pt-24">
      <section className="bg-[linear-gradient(120deg,var(--ws-primary)_0%,var(--ws-primary-strong)_100%)] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-teal-100/90">WeSkill LMS</p>
              <h1 className="text-4xl font-extrabold sm:text-5xl">Khóa học của tôi</h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                Vào phòng học online, xem video bài học và theo dõi tiến độ học tập của bạn.
              </p>
            </div>
            <div className="grid min-w-[320px] grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-bold">{courses.length}</p>
                <p className="mt-1 text-xs text-white/80">Khóa học</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-bold">{averageProgress}%</p>
                <p className="mt-1 text-xs text-white/80">Trung bình</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-2xl font-bold">
                  {completedLessons}/{totalLessons}
                </p>
                <p className="mt-1 text-xs text-white/80">Bài học</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {errorMessage && (
          <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{errorMessage}</p>
        )}

        {isLoading ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[var(--ws-primary)]"></div>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-3xl border border-[var(--ws-border)] bg-white p-10 text-center shadow-sm">
            <GraduationCap className="mx-auto mb-4 text-[var(--ws-primary)]" size={44} />
            <h2 className="text-2xl font-bold text-[var(--ws-ink-strong)]">Chưa có khóa học đang học</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--ws-muted)]">
              Khi đăng ký của bạn được kích hoạt, khóa học sẽ xuất hiện ở đây để bạn học online.
            </p>
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="mt-6 rounded-xl bg-[var(--ws-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--ws-primary-strong)]"
            >
              Khám phá khóa học
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((item) => {
              const course = item.course || {};
              const roadmap = item.roadmap || {};
              const progress = roadmap.progressPercent || 0;

              return (
                <article
                  key={course.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <img
                    src={course.thumbnailUrl || PLACEHOLDER_COURSE_IMAGE}
                    alt={course.title || "Khóa học"}
                    className="h-44 w-full border-b border-slate-100 object-cover"
                  />
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--ws-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--ws-primary-strong)]">
                        <BookOpenCheck size={14} />
                        Đang học
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${getProgressColor(progress)}`}>
                        {getProgressText(progress)}
                      </span>
                    </div>

                    <h2 className="line-clamp-2 text-xl font-extrabold text-slate-950">{course.title || course.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{course.description}</p>

                    <div className="mt-5">
                      <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
                        <span>Tiến độ</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-slate-200">
                        <div className={`h-2.5 rounded-full ${getProgressColor(progress)}`} style={{ width: `${progress}%` }} />
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Bài học</p>
                        <p className="mt-1 font-bold text-slate-900">
                          {roadmap.completedLessons || 0}/{roadmap.totalLessons || 0}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock size={13} />
                          Thời lượng
                        </p>
                        <p className="mt-1 font-bold text-slate-900">{roadmap.estimatedTime || "Đang cập nhật"}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/learn/${course.id}`)}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--ws-primary)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--ws-primary-strong)]"
                    >
                      Vào phòng học
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
