# Kế Hoạch Phát Triển Học Online Trên WeSkill

## Summary
Xây MVP LMS cho học viên học trực tiếp trên web: học viên có `enrollment active` được vào phòng học, xem video YouTube/Vimeo hoặc `videoUrl`, đọc mô tả bài học, đánh dấu hoàn thành và theo dõi tiến độ. Không làm upload video, quiz, bài tập, chứng chỉ hoặc payment gateway thật trong giai đoạn này.

## Key Changes
- Backend có nhóm API `/v1/learning`:
  - `GET /learning/me`: trả danh sách khóa học học viên đã đăng ký, kèm course, roadmap summary và progress.
  - `GET /learning/courses/:courseId`: trả chi tiết phòng học nếu user có enrollment active.
  - `PATCH /learning/enrollments/:enrollmentId/lessons/:lessonKey/progress`: cập nhật hoàn thành/chưa hoàn thành.
- Roadmap giữ cấu trúc `modules -> lessons`, mỗi lesson có `key` ổn định để lưu progress.
- Enrollment dùng `progress` map, key là `lesson.key`, value gồm `{ completed, completedAt }`.
- Admin roadmap là nơi nhập bài học, gồm `title`, `description`, `durationMinutes`, `youtubeUrl` hoặc `videoUrl`, `imageUrl`, và `resources`.

## Frontend Implementation
- Route `/roadmap` là “Khóa học của tôi” và lấy dữ liệu từ API thật.
- Route `/learn/:courseId` hiển thị sidebar module/bài học, vùng video, ảnh bài học, mô tả, tài liệu và nút đánh dấu hoàn thành.
- Video ưu tiên render YouTube/Vimeo bằng iframe; nếu không có thì render `videoUrl` bằng `<video controls>`.
- Lesson chưa có video hiển thị trạng thái “Bài học đang cập nhật video”.
- Progress cập nhật ngay trên UI sau khi API thành công.

## Backend Implementation
- `learningService` kiểm tra quyền truy cập bằng điều kiện user đã đăng nhập và tồn tại enrollment `{ userId, courseId, status: "active" }`.
- Khi trả roadmap cho học viên:
  - sort module theo `order`, lesson theo `order`
  - tính `totalLessons`, `completedLessons`, `progressPercent`
  - merge trạng thái progress từ enrollment vào từng lesson
- `roadmapService.saveRoadmap()` normalize lesson key, giữ key cũ và tạo key mới khi thiếu.
- Seed data có khóa học, video YouTube mẫu và enrollment active cho `student@weskill.vn`.

## Payment Notes
- Học viên đăng ký không cần xác nhận email.
- Giá thanh toán lấy từ enrollment `finalPrice`, được backend tính theo hình thức học.
- Kênh thẻ là mô phỏng nội bộ và kích hoạt enrollment ngay khi thanh toán thành công.
- Kênh ngân hàng/QR tạo payment pending; enrollment chỉ active khi payment được xác nhận paid.

## Test Plan
- Login student, gọi `GET /learning/me` thấy danh sách khóa học active.
- Student chưa enroll gọi `GET /learning/courses/:courseId` nhận `403`.
- Student active enrollment đánh dấu lesson hoàn thành, gọi lại thấy progress tăng.
- Admin/instructor lưu roadmap không làm mất lesson key cũ.
- Frontend build thành công và các route `/courses`, `/register/:courseId`, `/payment/:courseId`, `/roadmap`, `/learn/:courseId` hoạt động.
