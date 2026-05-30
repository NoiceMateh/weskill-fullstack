import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import { coursesByTrack } from "../data/coursesData";

function CoursesSection() {
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState("technology");

  const trackNames = {
    technology: "Công nghệ",
    creative: "Sáng tạo",
    business: "Kinh doanh",
  };

  const displayCourses = coursesByTrack[activeTrack].slice(0, 3);

  return (
    <section className="py-16">
      <div className="ws-section">
        <div className="ws-card rounded-[36px] p-6 md:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-primary-strong)]">Featured courses</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-[var(--ws-ink)] md:text-4xl">Khóa học nổi bật được gom theo ba hướng nghề chính.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ws-ink-soft)]">
              Mỗi khóa học đều được thiết kế để cung cấp kiến thức thực tế và kỹ năng cần thiết cho sự nghiệp của bạn.
              </p>
            </div>

            <button type="button" onClick={() => navigate("/courses")} className="ws-button-secondary w-fit">
              Xem tất cả khóa học
            </button>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {Object.entries(trackNames).map(([key, name]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTrack(key)}
                className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                  activeTrack === key
                    ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)] text-[var(--ws-primary-strong)]"
                    : "border-[var(--ws-border)] bg-white text-[var(--ws-ink-soft)] hover:border-[var(--ws-primary)] hover:text-[var(--ws-primary-strong)]"
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {displayCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CoursesSection;
