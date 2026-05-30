import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTracks } from "../constants/tracks";
import { coursesData } from "../data/coursesData";

export default function CourseSearchSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  const tracks = getAllTracks();
  const availableCourses = selectedTrack
    ? coursesData.filter((course) => course.track === selectedTrack)
    : coursesData;

  const learningMethods = [
    { value: "online", label: "Học trực tuyến" },
    { value: "zoom", label: "Lớp live" },
    { value: "offline", label: "Học tại lớp" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const handleSearch = () => {
    const filters = {};
    if (searchQuery.trim()) filters.query = searchQuery.trim();
    if (selectedTrack) filters.track = selectedTrack;
    if (selectedCourse) filters.course = selectedCourse;
    if (selectedMethod) filters.method = selectedMethod;

    navigate("/courses", { state: { searchFilters: filters } });
  };

  return (
    <section className="-mt-8 pb-8">
      <div className="ws-section">
        <div className="ws-card rounded-[32px] p-6 md:p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-primary-strong)]">Course discovery</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-[var(--ws-ink)]">Tìm khóa học phù hợp theo mục tiêu, nhóm ngành và cách học.</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[var(--ws-ink-soft)]">
              Tìm kiếm khóa học theo từ khóa, nhóm ngành, tên khóa học hoặc hình thức học. Lọc nhanh để chọn đúng khóa học phù hợp với bạn.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_auto]">
            <div>
              <label htmlFor="course-search" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[var(--ws-ink-soft)]">
                Từ khóa
              </label>
              <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ws-ink-muted)]" />
                <input
                  id="course-search"
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="       Ví dụ: frontend, AI, marketing"
                  className="ws-input pl-11"
                />
              </div>
            </div>

            <div>
              <label htmlFor="track-select" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[var(--ws-ink-soft)]">
                Nhóm ngành
              </label>
              <select
                id="track-select"
                value={selectedTrack}
                onChange={(event) => {
                  setSelectedTrack(event.target.value);
                  setSelectedCourse("");
                }}
                className="ws-select"
              >
                <option value="">Tất cả</option>
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="course-select" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[var(--ws-ink-soft)]">
                Khóa học
              </label>
              <select
                id="course-select"
                value={selectedCourse}
                onChange={(event) => setSelectedCourse(event.target.value)}
                disabled={!selectedTrack}
                className="ws-select"
              >
                <option value="">{selectedTrack ? "Chọn khóa học" : "Chọn nhóm ngành trước"}</option>
                {availableCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="method-select" className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[var(--ws-ink-soft)]">
                Hình thức học
              </label>
              <select
                id="method-select"
                value={selectedMethod}
                onChange={(event) => setSelectedMethod(event.target.value)}
                className="ws-select"
              >
                <option value="">Tất cả</option>
                {learningMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button type="button" onClick={handleSearch} className="ws-button-primary min-h-[52px] w-full min-w-36">
                Tìm khóa học
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
