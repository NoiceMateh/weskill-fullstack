// Skill areas taxonomy

export const SKILL_CATEGORIES = {
  TECHNICAL: "technical",
  SOFT: "soft",
  BUSINESS: "business",
  CREATIVE: "creative"
};

export const SKILL_AREAS = {
  // Technical Skills
  technical_skills: {
    name: "Kỹ Năng Kỹ Thuật",
    category: SKILL_CATEGORIES.TECHNICAL,
    color: "bg-blue-100 text-blue-800",
    icon: "⚙️"
  },
  programming: {
    name: "Lập Trình",
    category: SKILL_CATEGORIES.TECHNICAL,
    color: "bg-blue-100 text-blue-800",
    icon: "💻"
  },
  web_development: {
    name: "Phát Triển Web",
    category: SKILL_CATEGORIES.TECHNICAL,
    color: "bg-blue-100 text-blue-800",
    icon: "🌐"
  },
  mobile_development: {
    name: "Phát Triển Mobile",
    category: SKILL_CATEGORIES.TECHNICAL,
    color: "bg-blue-100 text-blue-800",
    icon: "📱"
  },
  data_science: {
    name: "Khoa Học Dữ Liệu & AI",
    category: SKILL_CATEGORIES.TECHNICAL,
    color: "bg-blue-100 text-blue-800",
    icon: "📊"
  },
  devops_cloud: {
    name: "DevOps & Điện Toán Đám Mây",
    category: SKILL_CATEGORIES.TECHNICAL,
    color: "bg-blue-100 text-blue-800",
    icon: "☁️"
  },

  // Soft Skills
  problem_solving: {
    name: "Giải Quyết Vấn Đề",
    category: SKILL_CATEGORIES.SOFT,
    color: "bg-purple-100 text-purple-800",
    icon: "🧩"
  },
  communication: {
    name: "Giao Tiếp",
    category: SKILL_CATEGORIES.SOFT,
    color: "bg-purple-100 text-purple-800",
    icon: "💬"
  },
  teamwork: {
    name: "Làm Việc Nhóm",
    category: SKILL_CATEGORIES.SOFT,
    color: "bg-purple-100 text-purple-800",
    icon: "🤝"
  },
  leadership: {
    name: "Lãnh Đạo",
    category: SKILL_CATEGORIES.SOFT,
    color: "bg-purple-100 text-purple-800",
    icon: "👥"
  },
  critical_thinking: {
    name: "Tư Duy Phản Biện",
    category: SKILL_CATEGORIES.SOFT,
    color: "bg-purple-100 text-purple-800",
    icon: "🧠"
  },
  career_readiness: {
    name: "Sẵn Sàng Sự Nghiệp",
    category: SKILL_CATEGORIES.SOFT,
    color: "bg-purple-100 text-purple-800",
    icon: "🎯"
  },

  // Business Skills
  business_strategy: {
    name: "Chiến Lược Kinh Doanh",
    category: SKILL_CATEGORIES.BUSINESS,
    color: "bg-orange-100 text-orange-800",
    icon: "📈"
  },
  entrepreneurship: {
    name: "Khởi Nghiệp",
    category: SKILL_CATEGORIES.BUSINESS,
    color: "bg-orange-100 text-orange-800",
    icon: "🚀"
  },
  marketing: {
    name: "Tiếp Thị",
    category: SKILL_CATEGORIES.BUSINESS,
    color: "bg-orange-100 text-orange-800",
    icon: "📢"
  },
  sales: {
    name: "Bán Hàng",
    category: SKILL_CATEGORIES.BUSINESS,
    color: "bg-orange-100 text-orange-800",
    icon: "💰"
  },
  finance: {
    name: "Tài Chính",
    category: SKILL_CATEGORIES.BUSINESS,
    color: "bg-orange-100 text-orange-800",
    icon: "💳"
  },
  analysis: {
    name: "Phân Tích & Dữ Liệu",
    category: SKILL_CATEGORIES.BUSINESS,
    color: "bg-orange-100 text-orange-800",
    icon: "📊"
  },

  // Creative Skills
  design: {
    name: "Thiết Kế",
    category: SKILL_CATEGORIES.CREATIVE,
    color: "bg-pink-100 text-pink-800",
    icon: "🎨"
  },
  user_experience: {
    name: "Trải Nghiệm Người Dùng",
    category: SKILL_CATEGORIES.CREATIVE,
    color: "bg-pink-100 text-pink-800",
    icon: "✨"
  },
  visual_communication: {
    name: "Giao Tiếp Hình Ảnh",
    category: SKILL_CATEGORIES.CREATIVE,
    color: "bg-pink-100 text-pink-800",
    icon: "🖼️"
  },
  content_creation: {
    name: "Tạo Nội Dung",
    category: SKILL_CATEGORIES.CREATIVE,
    color: "bg-pink-100 text-pink-800",
    icon: "🎬"
  },
  branding: {
    name: "Xây Dựng Thương Hiệu",
    category: SKILL_CATEGORIES.CREATIVE,
    color: "bg-pink-100 text-pink-800",
    icon: "💎"
  },
  storytelling: {
    name: "Kể Chuyện",
    category: SKILL_CATEGORIES.CREATIVE,
    color: "bg-pink-100 text-pink-800",
    icon: "📖"
  }
};

export const getSkillArea = (skillKey) => {
  return SKILL_AREAS[skillKey];
};

export const getSkillsByCategory = (category) => {
  return Object.values(SKILL_AREAS).filter(skill => skill.category === category);
};

export const getAllSkills = () => {
  return Object.values(SKILL_AREAS);
};
