export const courseRoadmaps = {
  1: {
    courseId: 1,
    courseName: "Phát triển Web Full-stack",
    totalModules: 6,
    totalLessons: 24,
    estimatedTime: "42 giờ",
    progress: 76,
    modules: [
      {
        id: 1,
        title: "Nền tảng Frontend",
        completed: true,
        lessons: [
          { id: 1, title: "HTML/CSS thực hành", completed: true, duration: "35 phút" },
          { id: 2, title: "JavaScript ES6+", completed: true, duration: "45 phút" },
          { id: 3, title: "DOM và event", completed: true, duration: "40 phút" },
          { id: 4, title: "Bài tập mini project", completed: true, duration: "60 phút" },
        ],
      },
      {
        id: 2,
        title: "React cơ bản",
        completed: true,
        lessons: [
          { id: 5, title: "Component và JSX", completed: true, duration: "35 phút" },
          { id: 6, title: "State và Props", completed: true, duration: "45 phút" },
          { id: 7, title: "useEffect và lifecycle", completed: true, duration: "40 phút" },
          { id: 8, title: "Quản lý form", completed: true, duration: "45 phút" },
        ],
      },
      {
        id: 3,
        title: "Backend với Node.js",
        completed: true,
        lessons: [
          { id: 9, title: "Express cơ bản", completed: true, duration: "40 phút" },
          { id: 10, title: "Thiết kế REST API", completed: true, duration: "45 phút" },
          { id: 11, title: "Xác thực JWT", completed: false, duration: "50 phút" },
          { id: 12, title: "Kết nối PostgreSQL", completed: false, duration: "55 phút" },
        ],
      },
      {
        id: 4,
        title: "Triển khai dự án",
        completed: false,
        lessons: [
          { id: 13, title: "Docker cơ bản", completed: false, duration: "45 phút" },
          { id: 14, title: "CI/CD với GitHub Actions", completed: false, duration: "50 phút" },
          { id: 15, title: "Giám sát và logging", completed: false, duration: "40 phút" },
          { id: 16, title: "Chuẩn bị demo", completed: false, duration: "35 phút" },
        ],
      },
      {
        id: 5,
        title: "Dự án cuối khóa",
        completed: false,
        lessons: [
          { id: 17, title: "Phân tích yêu cầu", completed: false, duration: "30 phút" },
          { id: 18, title: "Xây dựng sprint backlog", completed: false, duration: "35 phút" },
          { id: 19, title: "Triển khai tính năng", completed: false, duration: "90 phút" },
          { id: 20, title: "Review code", completed: false, duration: "45 phút" },
        ],
      },
      {
        id: 6,
        title: "Chuẩn bị việc làm",
        completed: false,
        lessons: [
          { id: 21, title: "Tối ưu CV kỹ thuật", completed: false, duration: "30 phút" },
          { id: 22, title: "Xây dựng portfolio", completed: false, duration: "40 phút" },
          { id: 23, title: "Mock interview", completed: false, duration: "45 phút" },
          { id: 24, title: "Kế hoạch ứng tuyển", completed: false, duration: "30 phút" },
        ],
      },
    ],
  },
  2: {
    courseId: 2,
    courseName: "Phân tích Dữ liệu & AI",
    totalModules: 5,
    totalLessons: 20,
    estimatedTime: "36 giờ",
    progress: 48,
    modules: [
      {
        id: 1,
        title: "Python và xử lý dữ liệu",
        completed: true,
        lessons: [
          { id: 1, title: "Python cho phân tích", completed: true, duration: "40 phút" },
          { id: 2, title: "Pandas căn bản", completed: true, duration: "50 phút" },
          { id: 3, title: "Làm sạch dữ liệu", completed: true, duration: "55 phút" },
          { id: 4, title: "Bài tập dữ liệu thực tế", completed: true, duration: "60 phút" },
        ],
      },
      {
        id: 2,
        title: "SQL và trực quan hóa",
        completed: true,
        lessons: [
          { id: 5, title: "SQL truy vấn cơ bản", completed: true, duration: "35 phút" },
          { id: 6, title: "Join và window function", completed: true, duration: "55 phút" },
          { id: 7, title: "Dashboard với Power BI", completed: false, duration: "60 phút" },
          { id: 8, title: "Báo cáo insight", completed: false, duration: "45 phút" },
        ],
      },
      {
        id: 3,
        title: "Machine Learning căn bản",
        completed: false,
        lessons: [
          { id: 9, title: "Mô hình supervised learning", completed: false, duration: "60 phút" },
          { id: 10, title: "Đánh giá model", completed: false, duration: "45 phút" },
          { id: 11, title: "Feature engineering", completed: false, duration: "55 phút" },
          { id: 12, title: "Triển khai thử nghiệm", completed: false, duration: "50 phút" },
        ],
      },
      {
        id: 4,
        title: "Dự án phân tích dữ liệu",
        completed: false,
        lessons: [
          { id: 13, title: "Xác định KPI", completed: false, duration: "30 phút" },
          { id: 14, title: "Thu thập dữ liệu", completed: false, duration: "45 phút" },
          { id: 15, title: "Xây dashboard", completed: false, duration: "75 phút" },
          { id: 16, title: "Trình bày kết quả", completed: false, duration: "35 phút" },
        ],
      },
      {
        id: 5,
        title: "Hoàn thiện portfolio",
        completed: false,
        lessons: [
          { id: 17, title: "Đóng gói case study", completed: false, duration: "30 phút" },
          { id: 18, title: "Tối ưu hồ sơ LinkedIn", completed: false, duration: "25 phút" },
          { id: 19, title: "Mock interview dữ liệu", completed: false, duration: "45 phút" },
          { id: 20, title: "Kế hoạch ứng tuyển", completed: false, duration: "30 phút" },
        ],
      },
    ],
  },
  3: {
    courseId: 3,
    courseName: "Phát triển Mobile với React Native",
    totalModules: 5,
    totalLessons: 18,
    estimatedTime: "32 giờ",
    progress: 34,
    modules: [
      {
        id: 1,
        title: "React Native cơ bản",
        completed: true,
        lessons: [
          { id: 1, title: "Cài đặt môi trường", completed: true, duration: "30 phút" },
          { id: 2, title: "Component mobile", completed: true, duration: "40 phút" },
          { id: 3, title: "Điều hướng màn hình", completed: true, duration: "45 phút" },
        ],
      },
      {
        id: 2,
        title: "Quản lý dữ liệu và API",
        completed: false,
        lessons: [
          { id: 4, title: "Gọi API REST", completed: false, duration: "45 phút" },
          { id: 5, title: "Quản lý state", completed: false, duration: "50 phút" },
          { id: 6, title: "Xử lý cache", completed: false, duration: "35 phút" },
          { id: 7, title: "Authentication", completed: false, duration: "45 phút" },
        ],
      },
      {
        id: 3,
        title: "Thiết kế UI mobile",
        completed: false,
        lessons: [
          { id: 8, title: "Thiết kế responsive", completed: false, duration: "40 phút" },
          { id: 9, title: "Animation cơ bản", completed: false, duration: "35 phút" },
          { id: 10, title: "Tối ưu trải nghiệm", completed: false, duration: "45 phút" },
        ],
      },
      {
        id: 4,
        title: "Dự án thực hành",
        completed: false,
        lessons: [
          { id: 11, title: "Lập kế hoạch sprint", completed: false, duration: "30 phút" },
          { id: 12, title: "Xây dựng tính năng cốt lõi", completed: false, duration: "80 phút" },
          { id: 13, title: "Kiểm thử ứng dụng", completed: false, duration: "45 phút" },
          { id: 14, title: "Tối ưu hiệu năng", completed: false, duration: "40 phút" },
        ],
      },
      {
        id: 5,
        title: "Phát hành ứng dụng",
        completed: false,
        lessons: [
          { id: 15, title: "Build iOS/Android", completed: false, duration: "40 phút" },
          { id: 16, title: "Chuẩn bị store listing", completed: false, duration: "35 phút" },
          { id: 17, title: "Quy trình review", completed: false, duration: "30 phút" },
          { id: 18, title: "Theo dõi sau phát hành", completed: false, duration: "25 phút" },
        ],
      },
    ],
  },
  4: {
    courseId: 4,
    courseName: "DevOps & Điện toán đám mây",
    totalModules: 4,
    totalLessons: 16,
    estimatedTime: "28 giờ",
    progress: 22,
    modules: [
      {
        id: 1,
        title: "Linux và hệ thống",
        completed: true,
        lessons: [
          { id: 1, title: "Linux command line", completed: true, duration: "35 phút" },
          { id: 2, title: "Quản lý service", completed: true, duration: "40 phút" },
          { id: 3, title: "Networking cơ bản", completed: false, duration: "45 phút" },
          { id: 4, title: "Bài lab thực hành", completed: false, duration: "50 phút" },
        ],
      },
      {
        id: 2,
        title: "Docker và container",
        completed: false,
        lessons: [
          { id: 5, title: "Docker image", completed: false, duration: "35 phút" },
          { id: 6, title: "Docker compose", completed: false, duration: "40 phút" },
          { id: 7, title: "Bảo mật container", completed: false, duration: "45 phút" },
          { id: 8, title: "Lab triển khai", completed: false, duration: "60 phút" },
        ],
      },
      {
        id: 3,
        title: "CI/CD pipeline",
        completed: false,
        lessons: [
          { id: 9, title: "GitHub Actions", completed: false, duration: "45 phút" },
          { id: 10, title: "Tự động kiểm thử", completed: false, duration: "35 phút" },
          { id: 11, title: "Triển khai staging", completed: false, duration: "40 phút" },
          { id: 12, title: "Triển khai production", completed: false, duration: "50 phút" },
        ],
      },
      {
        id: 4,
        title: "Cloud cơ bản",
        completed: false,
        lessons: [
          { id: 13, title: "Dịch vụ AWS cốt lõi", completed: false, duration: "40 phút" },
          { id: 14, title: "Thiết kế hạ tầng", completed: false, duration: "45 phút" },
          { id: 15, title: "Giám sát hệ thống", completed: false, duration: "35 phút" },
          { id: 16, title: "Báo cáo tổng kết", completed: false, duration: "25 phút" },
        ],
      },
    ],
  },
};

export const courseLearningPlans = {
  1: {
    method: "zoom",
    methodLabel: "Học Zoom",
    materials: [
      { title: "Slide buổi học", type: "PDF" },
      { title: "Mẫu source code demo", type: "Git repository" },
      { title: "Checklist bài tập tuần", type: "Document" },
    ],
    videos: [
      { title: "React Project Structure", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
      { title: "Node.js REST API", url: "https://www.youtube.com/watch?v=l8WPWK9mS5M" },
    ],
    schedules: [
      { day: "Thứ 3", time: "19:30 - 21:30", mode: "Zoom trực tiếp", room: "Zoom Room FS-01" },
      { day: "Thứ 6", time: "19:30 - 21:30", mode: "Zoom trực tiếp", room: "Zoom Room FS-01" },
    ],
  },
  2: {
    method: "online",
    methodLabel: "Học Online",
    materials: [
      { title: "Notebook Python theo module", type: "Jupyter" },
      { title: "Bộ dữ liệu thực hành", type: "Dataset" },
      { title: "Template báo cáo insight", type: "Power BI" },
    ],
    videos: [
      { title: "Python for Data Analysis", url: "https://www.youtube.com/watch?v=r-uOLxNrNk8" },
      { title: "SQL Tutorial for Beginners", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" },
      { title: "Machine Learning Basics", url: "https://www.youtube.com/watch?v=ukzFI9rgwfU" },
    ],
    schedules: [],
  },
  3: {
    method: "hybrid",
    methodLabel: "Học Hybrid",
    materials: [
      { title: "Workbook React Native", type: "PDF" },
      { title: "Bộ UI kit mobile", type: "Figma" },
      { title: "Checklist phát hành app", type: "Document" },
    ],
    videos: [
      { title: "React Native Tutorial", url: "https://www.youtube.com/watch?v=0-S5a0eXPoc" },
      { title: "Expo for Beginners", url: "https://www.youtube.com/watch?v=ANdSdIlgsEw" },
    ],
    schedules: [
      { day: "Thứ 4", time: "19:30 - 21:00", mode: "Zoom lý thuyết", room: "Zoom Room MB-02" },
      { day: "Chủ nhật", time: "09:00 - 11:30", mode: "Học trực tiếp thực hành", room: "Cơ sở TP.HCM - Phòng A2" },
    ],
  },
  4: {
    method: "offline",
    methodLabel: "Học Trực tiếp",
    materials: [
      { title: "Lab guide hệ thống", type: "PDF" },
      { title: "Mẫu cấu hình CI/CD", type: "YAML" },
    ],
    videos: [
      { title: "Docker Crash Course", url: "https://www.youtube.com/watch?v=3c-iBn73dDE" },
    ],
    schedules: [
      { day: "Thứ 2", time: "18:30 - 21:00", mode: "Học trực tiếp", room: "Cơ sở TP.HCM - Lab DevOps" },
      { day: "Thứ 5", time: "18:30 - 21:00", mode: "Học trực tiếp", room: "Cơ sở TP.HCM - Lab DevOps" },
    ],
  },
};

export const getUserEnrolledCourses = () => {
  const enrolledCourses = [
    { courseId: 1, enrolledDate: "2026-03-01", progress: 76 },
    { courseId: 2, enrolledDate: "2026-03-05", progress: 48 },
    { courseId: 3, enrolledDate: "2026-03-12", progress: 34 },
    { courseId: 4, enrolledDate: "2026-03-20", progress: 22 },
  ];

  return enrolledCourses.map((enrollment) => ({
    ...enrollment,
    roadmap: courseRoadmaps[enrollment.courseId],
    learningPlan: courseLearningPlans[enrollment.courseId],
  }));
};
