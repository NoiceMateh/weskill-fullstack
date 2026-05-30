import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTrackConfig } from "../constants/tracks";
import { PLACEHOLDER_COURSE_IMAGE, TRACK_IMAGES } from "../assets/placeholders";

export default function TrackCard({ trackId }) {
  const navigate = useNavigate();
  const track = getTrackConfig(trackId);

  if (!track) return null;

  return (
    <article
      onClick={() => navigate("/courses", { state: { filter: trackId } })}
      className={`group cursor-pointer overflow-hidden rounded-[30px] border border-[var(--ws-border)] bg-gradient-to-br p-5 shadow-[var(--ws-shadow-2)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--ws-shadow-1)] ${track.bgGradient}`}
    >
      <div className="overflow-hidden rounded-[24px]">
        <img
          src={TRACK_IMAGES[trackId] || PLACEHOLDER_COURSE_IMAGE}
          alt={track.name}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <h3 className="text-2xl font-extrabold tracking-[-0.03em] text-[var(--ws-ink)]">{track.name}</h3>
        <span className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]" style={{ color: track.color }}>
          {track.courseCount} khóa
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--ws-ink-soft)]">{track.description}</p>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-[24px] border border-white/70 bg-white/75 p-4">
        <div>
          <p className="text-2xl font-extrabold" style={{ color: track.color }}>
            {track.courseCount}
          </p>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--ws-ink-soft)]">Khóa học</p>
        </div>
        <div>
          <p className="text-2xl font-extrabold text-[var(--ws-ink)]">{track.jobRate}%</p>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--ws-ink-soft)]">Tỷ lệ việc làm</p>
        </div>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold" style={{ color: track.color }}>
        Khám phá lộ trình
        <ArrowRight size={16} />
      </div>
    </article>
  );
}
