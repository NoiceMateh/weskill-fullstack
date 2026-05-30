import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ChevronLeft, Circle, FileText, PlayCircle } from "lucide-react";
import { PLACEHOLDER_COURSE_IMAGE } from "../assets/placeholders";
import { getLearningCourse, updateLearningLessonProgress } from "../services/learningService";
import { toMediaEmbedUrl } from "../utils/youtube";

const flattenLessons = (modules = []) =>
  modules.flatMap((module, moduleIndex) =>
    (module.lessons || []).map((lesson, lessonIndex) => ({
      ...lesson,
      moduleTitle: module.title,
      moduleIndex,
      lessonIndex,
    }))
  );

export default function Learn() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [selectedKey, setSelectedKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let alive = true;

    async function loadLearningCourse() {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const data = await getLearningCourse(courseId);
        if (!alive) return;
        setPayload(data);
        const lessons = flattenLessons(data?.roadmap?.modules || []);
        const firstOpen = lessons.find((lesson) => !lesson.completed) || lessons[0];
        setSelectedKey((current) => current || firstOpen?.key || "");
      } catch (error) {
        if (alive) setErrorMessage(error.message || "Không tải được phòng học.");
      } finally {
        if (alive) setIsLoading(false);
      }
    }

    loadLearningCourse();
    return () => {
      alive = false;
    };
  }, [courseId]);

  const lessons = useMemo(() => flattenLessons(payload?.roadmap?.modules || []), [payload]);
  const selectedLesson = lessons.find((lesson) => lesson.key === selectedKey) || lessons[0];
  const embedUrl = toMediaEmbedUrl(selectedLesson?.youtubeUrl || "");

  const handleToggleComplete = async () => {
    if (!payload?.enrollment?.id || !selectedLesson?.key) return;
    setIsSaving(true);
    setErrorMessage("");
    try {
      const updated = await updateLearningLessonProgress(payload.enrollment.id, selectedLesson.key, !selectedLesson.completed);
      setPayload(updated);
    } catch (error) {
      setErrorMessage(error.message || "Không cập nhật được tiến độ.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--ws-page)] pt-24">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--ws-primary)]"></div>
      </main>
    );
  }

  if (errorMessage && !payload) {
    return (
      <main className="min-h-screen bg-[var(--ws-page)] pt-24">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">Không mở được phòng học</h1>
            <p className="mt-3 text-sm text-red-700">{errorMessage}</p>
            <button
              type="button"
              onClick={() => navigate("/roadmap")}
              className="mt-6 rounded-xl bg-[var(--ws-primary)] px-5 py-3 text-sm font-semibold text-white"
            >
              Quay lại khóa học của tôi
            </button>
          </div>
        </div>
      </main>
    );
  }

  const course = payload?.course || {};
  const roadmap = payload?.roadmap || {};

  return (
    <main className="min-h-screen bg-[var(--ws-page)] pt-24">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/roadmap")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
              aria-label="Quay lại"
            >
              <ChevronLeft size={20} />
            </button>
            <img
              src={course.thumbnailUrl || PLACEHOLDER_COURSE_IMAGE}
              alt={course.title || "Khóa học"}
              className="h-14 w-14 rounded-xl border border-slate-200 object-cover"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ws-primary-strong)]">Phòng học online</p>
              <h1 className="text-xl font-extrabold text-slate-950 sm:text-2xl">{course.title || course.name}</h1>
            </div>
          </div>
          <div className="min-w-[220px]">
            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600">
              <span>{roadmap.completedLessons || 0}/{roadmap.totalLessons || 0} bài học</span>
              <span>{roadmap.progressPercent || 0}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-200">
              <div
                className="h-2.5 rounded-full bg-[var(--ws-primary)] transition-all"
                style={{ width: `${roadmap.progressPercent || 0}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[340px_1fr]">
        <aside className="max-h-[calc(100vh-150px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">Nội dung khóa học</h2>
          <div className="space-y-4">
            {(roadmap.modules || []).map((module, moduleIndex) => (
              <section key={`${module.title}-${moduleIndex}`}>
                <h3 className="mb-2 text-sm font-bold text-slate-900">
                  Module {moduleIndex + 1}: {module.title}
                </h3>
                <div className="space-y-2">
                  {(module.lessons || []).map((lesson) => {
                    const isSelected = lesson.key === selectedLesson?.key;
                    return (
                      <button
                        type="button"
                        key={lesson.key}
                        onClick={() => setSelectedKey(lesson.key)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                          isSelected
                            ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)]"
                            : "border-slate-100 bg-slate-50 hover:border-teal-200 hover:bg-white"
                        }`}
                      >
                        {lesson.completed ? (
                          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
                        ) : (
                          <Circle className="mt-0.5 shrink-0 text-slate-400" size={18} />
                        )}
                        <span>
                          <span className="block text-sm font-semibold text-slate-900">{lesson.title}</span>
                          <span className="mt-1 block text-xs text-slate-500">{lesson.duration}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </aside>

        <section className="space-y-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="aspect-video bg-slate-950">
              {embedUrl ? (
                <iframe
                  title={selectedLesson?.title || "Video bài học"}
                  src={embedUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : selectedLesson?.videoUrl ? (
                <video src={selectedLesson.videoUrl} controls className="h-full w-full bg-black" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
                  <PlayCircle size={46} className="mb-3 text-white/70" />
                  <p className="text-lg font-bold">Bài học đang cập nhật video</p>
                  <p className="mt-2 max-w-md text-sm text-white/70">Bạn vẫn có thể đọc mô tả và quay lại sau khi mentor cập nhật nội dung.</p>
                </div>
              )}
            </div>
          </div>

          {errorMessage && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{errorMessage}</p>}

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {selectedLesson?.imageUrl && (
              <img
                src={selectedLesson.imageUrl}
                alt={selectedLesson.title || "Ảnh bài học"}
                className="mb-5 h-56 w-full rounded-xl border border-slate-100 object-cover"
              />
            )}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ws-primary-strong)]">
                  {selectedLesson?.moduleTitle}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-950">{selectedLesson?.title}</h2>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {selectedLesson?.description || "Nội dung bài học sẽ được mentor cập nhật thêm."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleComplete}
                disabled={isSaving}
                className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition disabled:opacity-60 ${
                  selectedLesson?.completed
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "bg-[var(--ws-primary)] text-white hover:bg-[var(--ws-primary-strong)]"
                }`}
              >
                <CheckCircle2 size={18} />
                {selectedLesson?.completed ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
              </button>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-950">
              <FileText size={20} />
              Tài liệu bài học
            </h3>
            {selectedLesson?.resources?.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {selectedLesson.resources.map((resource, index) => (
                  <a
                    key={`${resource.url}-${index}`}
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 hover:border-teal-200 hover:bg-white"
                  >
                    {resource.title || "Tài liệu"}
                    <span className="ml-2 text-xs font-medium text-slate-500">{resource.type || "Link"}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Bài học này chưa có tài liệu đính kèm.</p>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
