/**
 * LoadingSkeleton.jsx
 * Skeleton loading cards for courses with shimmer animation
 */

function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-fade-up stagger-item">
          <div className="skeleton-card">
            {/* Thumbnail Skeleton */}
            <div className="skeleton skeleton-thumbnail" />

            {/* Content Skeleton */}
            <div className="space-y-3 p-5">
              {/* Level Badge */}
              <div className="skeleton" style={{ height: "12px", width: "60px" }} />

              {/* Title */}
              <div className="skeleton skeleton-title" />

              {/* Description Lines */}
              <div className="space-y-2">
                <div className="skeleton" style={{ height: "12px", width: "100%" }} />
                <div className="skeleton" style={{ height: "12px", width: "85%" }} />
              </div>

              {/* Skill Badges */}
              <div className="mt-4 flex gap-2">
                <div className="skeleton skeleton-badge" />
                <div className="skeleton skeleton-badge" />
              </div>

              {/* Learning Methods */}
              <div className="mt-4 flex gap-2">
                <div className="skeleton" style={{ height: "24px", width: "70px", borderRadius: "20px" }} />
                <div className="skeleton" style={{ height: "24px", width: "70px", borderRadius: "20px" }} />
                <div className="skeleton" style={{ height: "24px", width: "70px", borderRadius: "20px" }} />
              </div>

              {/* Info Row */}
              <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-100 p-3">
                <div className="skeleton" style={{ height: "16px", width: "100%" }} />
                <div className="skeleton" style={{ height: "16px", width: "100%" }} />
              </div>

              {/* Buttons */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="skeleton" style={{ height: "40px", borderRadius: "8px" }} />
                <div className="skeleton" style={{ height: "40px", borderRadius: "8px" }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
