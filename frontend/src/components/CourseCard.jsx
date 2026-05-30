import { ArrowRight, Clock3, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SkillBadges from "./SkillBadges";
import { getTrackConfig } from "../constants/tracks";
import { PLACEHOLDER_COURSE_IMAGE } from "../assets/placeholders";
import { formatShortLabels, getLowestFormatPrice } from "../adapters/courseAdapter";

function CourseCard({ course, showTrackBadge = true }) {
  const navigate = useNavigate();
  const trackConfig = getTrackConfig(course.track);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const formatCurrency = (num) => {
    if (!num) return "Liên hệ";
    return `${(num / 1000000).toFixed(1)}M`;
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <article
      className="group relative animate-fade-up overflow-hidden rounded-[24px] border border-[var(--ws-border)] bg-white shadow-[var(--ws-shadow-2)] transition duration-300 hover:shadow-[var(--ws-shadow-1)]"
      style={{
        boxShadow: showTrackBadge && trackConfig ? `0 1px 2px rgba(0,0,0,0.05), inset 0 4px 0 ${trackConfig.color}` : undefined,
        "--mx": `${mousePos.x}%`,
        "--my": `${mousePos.y}%`,
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(107, 188, 68, 0.08) 0%, transparent 50%)`,
        }}
      />

      <div className="relative overflow-hidden">
        <img
          src={course.thumbnailUrl || PLACEHOLDER_COURSE_IMAGE}
          alt={course.name}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.06]"
        />

        {showTrackBadge && trackConfig && (
          <div
            className="absolute left-4 top-4 rounded-full bg-white/94 px-3 py-1 text-[11px] font-bold uppercase backdrop-blur-sm"
            style={{ color: trackConfig.color }}
          >
            {trackConfig.name}
          </div>
        )}

        {course.badge && (
          <div className="absolute right-4 top-4 rounded-lg bg-white/94 px-3 py-1 text-[11px] font-bold uppercase text-[var(--ws-primary-strong)]">
            {course.badge}
          </div>
        )}
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase text-[var(--ws-ink-soft)]">{course.level}</p>
            <h3 className="mt-2 text-lg font-extrabold leading-7 text-[var(--ws-ink)] transition duration-300 group-hover:text-[var(--ws-primary)]">
              {course.name}
            </h3>
          </div>
          <div className="flex-shrink-0 rounded-[16px] bg-[var(--ws-primary-soft)] px-3 py-2 text-right">
            <p className="text-xs font-semibold text-[var(--ws-ink-soft)]">Từ</p>
            <p className="text-lg font-extrabold text-[var(--ws-primary-strong)]">{formatCurrency(getLowestFormatPrice(course))}</p>
          </div>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--ws-ink-soft)]">{course.desc}</p>

        {course.skillAreas?.length > 0 && (
          <div className="mt-4">
            <SkillBadges skillAreas={course.skillAreas} />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(course.learningMethods || {}).map(([key, method]) => {
            if (!method.available) return null;
            return (
              <span key={key} className="chip chip-primary animate-fade-up">
                {formatShortLabels[key] || key}
              </span>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-[18px] bg-[var(--ws-surface-strong)] p-4 text-sm">
          <div className="flex items-center gap-2 text-[var(--ws-ink-soft)]">
            <Clock3 size={16} className="text-[var(--ws-primary)]" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--ws-ink-soft)]">
            <Users size={16} className="text-[var(--ws-primary)]" />
            <span>{course.classSize}</span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => navigate(`/course/${course.id}`)} className="ws-button-secondary">
            Chi tiết
          </button>
          <button
            type="button"
            onClick={() => {
              const user = localStorage.getItem("user");
              if (user) {
                navigate(`/register/${course.id}`);
              } else {
                localStorage.setItem("redirectAfterLogin", `/register/${course.id}`);
                navigate("/login");
              }
            }}
            className="ws-button-primary"
          >
            <Zap size={14} />
            Đăng ký
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default CourseCard;
