import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import CourseSearchSection from "../components/CourseSearchSection";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { coursesData } from "../data/coursesData";
import { getAllTracks } from "../constants/tracks";
import { searchCourses } from "../utils/searchUtils";
import { getCourses } from "../services/courseService";
import { adaptSampleCourse, getLowestFormatPrice } from "../adapters/courseAdapter";
import "../styles/animations.css";

export default function Courses() {
  const location = useLocation();
  const initialFilter = location.state?.filter || "all";
  const searchFilters = location.state?.searchFilters || {};

  const [active, setActive] = useState(initialFilter);
  const [sortBy, setSortBy] = useState("newest");
  const [courseList, setCourseList] = useState(() => coursesData.map(adaptSampleCourse));
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const allTracks = getAllTracks();

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        const data = await getCourses();
        if (!isMounted) return;
        const sampleCourses = coursesData.map(adaptSampleCourse);
        const seen = new Set();
        const merged = [...data, ...sampleCourses].filter((course) => {
          const key = (course.slug || course.name || course.title || course.id).toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setCourseList(merged);
        setErrorMessage("");
      } catch (error) {
        if (!isMounted) return;
        setCourseList(coursesData.map(adaptSampleCourse));
        setErrorMessage(error.message || "Không tải được danh sách khóa học.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (searchFilters.track) {
      setActive(searchFilters.track);
    }
  }, [searchFilters.track]);

  const filterOptions = [{ label: "Tất cả", value: "all" }, ...allTracks.map((track) => ({ label: track.name, value: track.id }))];

  let filtered = courseList;

  if (searchFilters.query) {
    filtered = searchCourses(filtered, searchFilters.query);
  }

  if (active !== "all") {
    filtered = filtered.filter((course) => course.track === active);
  }

  if (searchFilters.course) {
    filtered = filtered.filter((course) => String(course.id) === String(searchFilters.course));
  }

  if (searchFilters.method) {
    filtered = filtered.filter((course) => course.learningMethods[searchFilters.method]?.available);
  }

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "popular") return (b.students || 0) - (a.students || 0);
      if (sortBy === "priceAsc") return getLowestFormatPrice(a) - getLowestFormatPrice(b);
      return 0;
    });
  }, [filtered, sortBy]);

  return (
    <main className="min-h-screen bg-white pt-24">
      <section className="border-b border-[var(--ws-border)] bg-[var(--ws-page)] py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-extrabold text-[var(--ws-ink-strong)]">Danh sách khóa học</h1>
        </div>
      </section>

      <CourseSearchSection />

      {errorMessage && (
        <div className="mx-auto mt-4 max-w-6xl px-4">
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{errorMessage}</div>
        </div>
      )}

      <section className="sticky top-20 z-10 border-y border-[var(--ws-border)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActive(option.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  active === option.value
                    ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)] text-[var(--ws-primary-strong)]"
                    : "border-[var(--ws-border)] text-[var(--ws-muted)] hover:bg-[var(--ws-page)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm text-[var(--ws-ink)] focus:border-[var(--ws-primary)] focus:outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="rating">Đánh giá cao</option>
              <option value="popular">Phổ biến</option>
              <option value="priceAsc">Giá thấp nhất</option>
            </select>
            <span className="text-sm text-[var(--ws-muted)]">{sorted.length} khóa học</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {isLoading ? (
          <div>
            <p className="mb-6 text-sm text-[var(--ws-muted)]">Đang tải danh sách khóa học...</p>
            <LoadingSkeleton count={6} />
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sorted.map((course) => (
              <CourseCard key={course.id} course={course} showTrackBadge={true} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--ws-border)] bg-white p-10 text-center">
            <p className="text-sm text-[var(--ws-muted)]">Không tìm thấy khóa học phù hợp bộ lọc hiện tại.</p>
            <button
              onClick={() => {
                setActive("all");
                setSortBy("newest");
              }}
              className="mt-4 rounded-lg bg-[var(--ws-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--ws-primary-strong)]"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

