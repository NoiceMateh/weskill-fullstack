export const TRACKS = {
  TECHNOLOGY: "technology",
  CREATIVE: "creative",
  BUSINESS: "business",
};

export const TRACK_CONFIG = {
  technology: {
    id: "technology",
    name: "Công nghệ",
    description: "Fullstack, dữ liệu, cloud và AI cho nhóm nghề kỹ thuật.",
    color: "#6BBC44",
    bgGradient: "from-[#F9FBFE] to-[#F0F8EC]",
    accentGradient: "from-[#6BBC44] to-[#57A235]",
    courseCount: 5,
    jobRate: 92,
  },
  creative: {
    id: "creative",
    name: "Sáng tạo",
    description: "UX/UI, content và branding cho nhóm thiết kế sản phẩm.",
    color: "#424453",
    bgGradient: "from-[#FFFFFF] to-[#F9FBFE]",
    accentGradient: "from-[#424453] to-[#414B54]",
    courseCount: 3,
    jobRate: 86,
  },
  business: {
    id: "business",
    name: "Kinh doanh",
    description: "Founder, marketing và quản trị cho nhóm vận hành doanh nghiệp.",
    color: "#85909B",
    bgGradient: "from-[#FFFFFF] to-[#F9FBFE]",
    accentGradient: "from-[#85909B] to-[#424453]",
    courseCount: 4,
    jobRate: 88,
  },
};

export const getTrackConfig = (trackId) => TRACK_CONFIG[trackId];

export const getAllTracks = () => Object.values(TRACK_CONFIG);
