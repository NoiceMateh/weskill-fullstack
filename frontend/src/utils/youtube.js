export function toYoutubeEmbedUrl(url) {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  const watch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  const embed = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return `https://www.youtube.com/embed/${embed[1]}`;
  return "";
}

export function toMediaEmbedUrl(url) {
  const youtube = toYoutubeEmbedUrl(url);
  if (youtube) return youtube;

  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  const vimeo = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return "";
}
