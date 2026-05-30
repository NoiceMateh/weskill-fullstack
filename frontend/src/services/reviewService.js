import { apiRequest } from "../lib/api";

const DUMMY_REVIEWS_BY_COURSE = {
  default: [
    {
      id: "dummy-1",
      authorName: "Tran Minh",
      rating: 5,
      comment: "Noi dung thuc chien, de ap dung ngay vao cong viec.",
      createdAt: "2026-01-14T00:00:00.000Z",
    },
    {
      id: "dummy-2",
      authorName: "Le An",
      rating: 4,
      comment: "Mentor ho tro ky, bai tap va du an ro rang.",
      createdAt: "2026-02-02T00:00:00.000Z",
    },
  ],
};

const mapReview = (item, index) => ({
  id: item?.id || item?._id || `review-${index}`,
  authorName: item?.authorName || item?.userName || "Hoc vien",
  rating: Number(item?.rating) || 5,
  comment: item?.comment || item?.content || "",
  createdAt: item?.createdAt || null,
});

export async function getCourseReviews(courseId) {
  try {
    const response = await apiRequest(`/courses/${courseId}/reviews`);
    const list = response?.data?.results || response?.data || [];
    const normalized = Array.isArray(list) ? list.map(mapReview) : [];

    if (normalized.length > 0) {
      return normalized;
    }

    return DUMMY_REVIEWS_BY_COURSE[courseId] || DUMMY_REVIEWS_BY_COURSE.default;
  } catch {
    return DUMMY_REVIEWS_BY_COURSE[courseId] || DUMMY_REVIEWS_BY_COURSE.default;
  }
}

export async function createCourseReview(courseId, payload) {
  try {
    const response = await apiRequest(`/courses/${courseId}/reviews`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const created = response?.data || response;
    return mapReview(created, 0);
  } catch {
    return {
      id: `local-${Date.now()}`,
      authorName: payload?.authorName || "Hoc vien",
      rating: Number(payload?.rating) || 5,
      comment: payload?.comment || "",
      createdAt: new Date().toISOString(),
    };
  }
}
