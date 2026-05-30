/**
 * ProgressBar.jsx
 * Animated progress bar component from design system
 */

function ProgressBar({ 
  value = 0, 
  max = 100, 
  label = "", 
  showPercentage = true,
  color = "from-purple-500 to-teal-500",
  animated = true,
  height = "h-2",
  className = "" 
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={`progress-bar-container ${height}`}>
        <div
          className={`progress-bar-fill bg-gradient-to-r ${color} ${
            animated ? "transition-all duration-1000 ease-out" : ""
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={Math.round(percentage)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={label || "Progress"}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
