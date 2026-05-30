import { useState } from "react";

export default function LearningFormatSelector({ course, onFormatChange }) {
  const [selectedFormat, setSelectedFormat] = useState("online");

  const formats = [
    {
      id: "online",
      label: "Online",
      description: "Tự học linh hoạt",
      details: course.learningMethods.online,
    },
    {
      id: "zoom",
      label: "Zoom",
      description: "Học live với giảng viên",
      details: course.learningMethods.zoom,
    },
    {
      id: "offline",
      label: "Offline",
      description: "Học tại trung tâm",
      details: course.learningMethods.offline,
    },
    {
      id: "hybrid",
      label: "Hybrid",
      description: "Online + Offline",
      details: course.learningMethods.hybrid,
    },
  ];

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
    if (onFormatChange) {
      onFormatChange(format);
    }
  };

  const selected = formats.find((f) => f.id === selectedFormat);
  const selectedDetails = selected?.details;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-[var(--ws-ink)]">Learning Format</h3>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {formats.map((format) => (
            <button
              key={format.id}
              onClick={() => handleFormatChange(format.id)}
              className={`rounded-lg border-2 p-3 text-center transition-all ${
                selectedFormat === format.id
                  ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)]"
                  : "border-[var(--ws-border)] bg-white hover:border-[var(--ws-primary)]"
              }`}
            >
              <p className="font-semibold text-sm text-[var(--ws-ink)]">{format.label}</p>
              <p className="text-xs text-[var(--ws-muted)]">{format.description}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedDetails && selectedDetails.available && (
        <div className="space-y-4 rounded-lg border border-[var(--ws-border)] bg-[var(--ws-page)] p-6">
          <div>
            <h4 className="mb-2 font-bold text-[var(--ws-ink)]">{selected.label} Details</h4>
            <div className="space-y-2 text-sm text-[var(--ws-muted)]">
              <div className="flex justify-between">
                <span>Giá</span>
                <span className="font-semibold text-[var(--ws-primary-strong)]">{selectedDetails.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Mô tả</span>
                <span className="font-semibold text-[var(--ws-ink)]">{selectedDetails.description || "Cập nhật sau"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedDetails && !selectedDetails.available && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
          <p className="text-sm font-semibold">ắp ra mắt</p>
          <p className="mt-1 text-sm">Phương thức học này sẽ có sẵn trong thời gian tới.</p>
        </div>
      )}
    </div>
  );
}

