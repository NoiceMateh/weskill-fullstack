export const formatVnd = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) return "Liên hệ";
  return `${value.toLocaleString("vi-VN")} ₫`;
};

export const parseVnd = (value) => {
  if (typeof value === "number") return value;
  const parsed = Number(String(value || "").replace(/\D/g, ""));
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const normalizeFormatType = (formatType = "online") => {
  const map = {
    remote: "zoom",
    oncampus: "offline",
  };
  return map[formatType] || formatType || "online";
};

export const formatLabels = {
  online: "Học trực tuyến",
  zoom: "Lớp live",
  offline: "Học tại lớp",
  hybrid: "Học hybrid",
};

export const formatShortLabels = {
  online: "Trực tuyến",
  zoom: "Lớp live",
  offline: "Tại lớp",
  hybrid: "Hybrid",
};

const defaultLearningMethods = (basePrice) => ({
  online: { available: true, price: formatVnd(basePrice), amount: basePrice },
  zoom: { available: false, price: formatVnd(basePrice), amount: basePrice },
  offline: { available: false, price: formatVnd(basePrice), amount: basePrice },
  hybrid: { available: false, price: formatVnd(basePrice), amount: basePrice },
});

const formatTypeMap = {
  online: "online",
  remote: "zoom",
  zoom: "zoom",
  oncampus: "offline",
  offline: "offline",
  hybrid: "hybrid",
};

const makeTrack = (category) => {
  const categoryName = (category?.name || "").toLowerCase();
  if (categoryName.includes("design") || categoryName.includes("sáng tạo") || categoryName.includes("sang tao")) return "creative";
  if (categoryName.includes("kinh doanh") || categoryName.includes("business")) return "business";
  return "technology";
};

const mapLevel = (level) => {
  const label = {
    beginner: "Cơ bản",
    intermediate: "Trung cấp",
    advanced: "Nâng cao",
    expert: "Chuyên gia",
  };
  return label[level] || level || "Tổng quát";
};

export const getLowestFormatPrice = (course) => {
  const prices = Object.values(course?.learningMethods || {})
    .filter((method) => method.available)
    .map((method) => method.amount || parseVnd(method.price))
    .filter(Boolean)
    .sort((a, b) => a - b);
  return prices[0] || 0;
};

export const getFormatAmount = (course, formatType) => {
  const key = normalizeFormatType(formatType);
  return course?.learningMethods?.[key]?.amount || course?.basePrice || 0;
};

export const adaptCourse = (course, source = "api") => {
  const formats = Array.isArray(course.formats) ? course.formats : [];
  const basePrice = Number(course.basePrice || course.priceAmount || parseVnd(course.price || course.paymentOptions?.upfront?.price));
  const learningMethods = defaultLearningMethods(basePrice);
  const rawFormats = [];

  formats.forEach((format) => {
    const key = formatTypeMap[format.formatType];
    if (!key) return;
    const amount = Number(format.priceOverride ?? basePrice);
    rawFormats.push({ ...format, formatType: key, priceOverride: amount });
    learningMethods[key] = {
      ...learningMethods[key],
      available: format.isActive !== false,
      price: formatVnd(amount),
      amount,
      sessionCount: format.sessionCount || 0,
      location: format.location || "",
    };
  });

  return {
    id: course.id || course._id,
    slug: course.slug || "",
    source,
    track: makeTrack(course.categoryId),
    thumbnailUrl: course.thumbnailUrl || "",
    icon: "📘",
    badge: course.badge || null,
    level: mapLevel(course.level),
    name: course.title,
    title: course.title,
    desc: course.description || "Khóa học đang cập nhật mô tả.",
    fullDesc: course.description || "Khóa học đang cập nhật mô tả chi tiết.",
    tags: (course.requiredSkills || []).map((s) => s.name).filter(Boolean),
    duration: `${course.durationWeeks || 0} tuần`,
    durationWeeks: course.durationWeeks || 0,
    classSize: "Theo cohort",
    instructor: "Giảng viên WeSkill",
    students: 0,
    rating: 4.8,
    basePrice,
    rawFormats,
    paymentOptions: {
      upfront: { available: true, price: formatVnd(basePrice), amount: basePrice },
      installment: { available: true, months: 6, monthlyPrice: formatVnd(Math.ceil(basePrice / 6)), totalPrice: formatVnd(basePrice), amount: basePrice },
    },
    learningMethods,
    selectedFormatPrice: formatVnd(getLowestFormatPrice({ learningMethods })),
    schedule: "Theo lịch khai giảng",
    jobPlacementRate: 85,
    careerServices: ["Tư vấn CV", "Hỗ trợ phỏng vấn", "Kết nối doanh nghiệp"],
    curriculum: (course.requiredSkills || []).map((s) => s.name).slice(0, 8),
    includes: ["Tài liệu học tập", "Hỗ trợ mentor", "Tham gia cộng đồng học viên"],
    bg: "relative bg-gradient-to-br from-teal-50 to-teal-100",
  };
};

export const adaptSampleCourse = (course) => {
  const learningMethods = {};
  Object.entries(course.learningMethods || {}).forEach(([key, method]) => {
    const normalizedKey = normalizeFormatType(key);
    const amount = parseVnd(method.price);
    learningMethods[normalizedKey] = {
      ...method,
      available: method.available !== false,
      price: formatVnd(amount),
      amount,
    };
  });

  const basePrice = parseVnd(course.price || course.paymentOptions?.upfront?.price || learningMethods.online?.price);
  const rawFormats = Object.entries(learningMethods).map(([formatType, method]) => ({
    formatType,
    priceOverride: method.amount || basePrice,
    isActive: method.available !== false,
    location: method.location || "",
    sessionCount: method.sessionCount || 0,
  }));

  return {
    ...course,
    source: "sample",
    title: course.name,
    basePrice,
    rawFormats,
    learningMethods,
    paymentOptions: {
      upfront: { available: true, price: formatVnd(basePrice), amount: basePrice },
      installment: {
        available: true,
        months: course.paymentOptions?.installment?.months || 6,
        monthlyPrice: formatVnd(Math.ceil(basePrice / (course.paymentOptions?.installment?.months || 6))),
        totalPrice: formatVnd(basePrice),
        amount: basePrice,
      },
    },
    selectedFormatPrice: formatVnd(getLowestFormatPrice({ learningMethods })),
  };
};
