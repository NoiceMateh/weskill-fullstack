import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listUsers, updateUserRole } from "../services/adminUserService";
import { getSiteContent, updateSiteContent } from "../services/siteContentService";
import { fetchAdminCourses, createCourse, updateCourse } from "../services/adminCourseService";
import { listCategories } from "../services/adminCategoryService";
import { getRoadmapByCourseId, saveRoadmap as putRoadmapApi } from "../services/roadmapService";
import { fetchAdminEnrollments, updateEnrollmentStatus } from "../services/adminEnrollmentService";
import { fetchAdminPayments, updatePaymentStatus } from "../services/adminPaymentService";

const ROLES = ["student", "instructor", "admin"];
const COURSE_LEVELS = ["beginner", "intermediate", "advanced", "expert"];
const ENROLLMENT_STATUSES = ["pending_payment", "active", "completed", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

function emptyLesson(order) {
  return {
    key: "",
    title: "",
    order,
    description: "",
    durationMinutes: 0,
    imageUrl: "",
    videoUrl: "",
    youtubeUrl: "",
  };
}

function emptyModule(order) {
  return { title: "", order, lessons: [emptyLesson(0)] };
}

function parseSkills(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((name) => ({ name }));
}

function serializeSkills(skills) {
  return Array.isArray(skills) ? skills.map((item) => item.name || item).join(", ") : "";
}

export default function Admin() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const isAdmin = user?.role === "admin";
  const isInstructor = user?.role === "instructor";
  const canAccess = isAdmin || isInstructor;
  const [tab, setTab] = useState(isAdmin ? "overview" : "roadmaps");

  const [users, setUsers] = useState([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [userMsg, setUserMsg] = useState("");

  const [site, setSite] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroImageUrl: "",
    consultationYoutubeUrl: "",
    faqs: [],
    chatbotSuggestions: [],
  });
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteMsg, setSiteMsg] = useState("");

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseMsg, setCourseMsg] = useState("");
  const [courseForm, setCourseForm] = useState({
    title: "",
    slug: "",
    description: "",
    thumbnailUrl: "",
    categoryId: "",
    level: "beginner",
    durationWeeks: 8,
    basePrice: 0,
    requiredSkills: "",
    formatsJson: JSON.stringify([{ formatType: "online", priceOverride: 0, isActive: true }], null, 2),
    isPublished: true,
  });
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [enrollmentsMsg, setEnrollmentsMsg] = useState("");
  const [enrollmentStatus, setEnrollmentStatus] = useState("");

  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsMsg, setPaymentsMsg] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewCounts, setOverviewCounts] = useState({ users: 0, courses: 0, enrollments: 0, payments: 0 });

  const [modules, setModules] = useState([emptyModule(0)]);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapMsg, setRoadmapMsg] = useState("");

  useEffect(() => {
    if (!user?.isLoggedIn || !canAccess) {
      navigate("/", { replace: true });
    }
  }, [user, canAccess, navigate]);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    setUsersLoading(true);
    setUserMsg("");
    try {
      const data = await listUsers({ page: usersPage, limit: 15, search: userSearch || undefined });
      setUsers(data?.results || []);
      setUsersTotal(data?.totalResults ?? 0);
    } catch (error) {
      setUserMsg(error.message || "Không tải được danh sách tài khoản.");
    } finally {
      setUsersLoading(false);
    }
  }, [isAdmin, usersPage, userSearch]);

  const loadSite = useCallback(async () => {
    if (!isAdmin) return;
    setSiteLoading(true);
    setSiteMsg("");
    try {
      const doc = await getSiteContent();
      setSite({
        heroTitle: doc.heroTitle || "",
        heroSubtitle: doc.heroSubtitle || "",
        heroImageUrl: doc.heroImageUrl || "",
        consultationYoutubeUrl: doc.consultationYoutubeUrl || "",
        faqs: Array.isArray(doc.faqs) ? doc.faqs : [],
        chatbotSuggestions: Array.isArray(doc.chatbotSuggestions) ? doc.chatbotSuggestions : [],
      });
    } catch (error) {
      setSiteMsg(error.message || "Không tải nội dung site.");
    } finally {
      setSiteLoading(false);
    }
  }, [isAdmin]);

  const loadCategories = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const docs = await listCategories({ limit: 100 });
      setCategories(docs);
    } catch {
      setCategories([]);
    }
  }, [isAdmin]);

  const loadCourses = useCallback(async () => {
    setCourseLoading(true);
    setCourseMsg("");
    try {
      const data = await fetchAdminCourses({ limit: 200 });
      setCourses(data?.results || []);
      if (!selectedCourseId && data?.results?.length) {
        setSelectedCourseId(data.results[0].id || data.results[0]._id);
      }
    } catch (error) {
      setCourseMsg(error.message || "Không tải được khóa học.");
    } finally {
      setCourseLoading(false);
    }
  }, [selectedCourseId]);

  const loadEnrollments = useCallback(async () => {
    if (!isAdmin) return;
    setEnrollmentsLoading(true);
    setEnrollmentsMsg("");
    try {
      const data = await fetchAdminEnrollments({ status: enrollmentStatus || undefined, limit: 100 });
      setEnrollments(data?.results || []);
    } catch (error) {
      setEnrollmentsMsg(error.message || "Không tải được ghi danh.");
    } finally {
      setEnrollmentsLoading(false);
    }
  }, [isAdmin, enrollmentStatus]);

  const loadPayments = useCallback(async () => {
    if (!isAdmin) return;
    setPaymentsLoading(true);
    setPaymentsMsg("");
    try {
      const data = await fetchAdminPayments({ status: paymentStatus || undefined, limit: 100 });
      setPayments(data?.results || []);
    } catch (error) {
      setPaymentsMsg(error.message || "Không tải được thanh toán.");
    } finally {
      setPaymentsLoading(false);
    }
  }, [isAdmin, paymentStatus]);

  const loadOverview = useCallback(async () => {
    if (!isAdmin) return;
    setOverviewLoading(true);
    try {
      const [usersData, coursesData, enrollmentsData, paymentsData] = await Promise.all([
        listUsers({ limit: 1 }),
        fetchAdminCourses({ limit: 1 }),
        fetchAdminEnrollments({ limit: 1 }),
        fetchAdminPayments({ limit: 1 }),
      ]);
      setOverviewCounts({
        users: usersData?.totalResults || 0,
        courses: coursesData?.totalResults || 0,
        enrollments: enrollmentsData?.totalResults || 0,
        payments: paymentsData?.totalResults || 0,
      });
    } catch {
      setOverviewCounts({ users: 0, courses: 0, enrollments: 0, payments: 0 });
    } finally {
      setOverviewLoading(false);
    }
  }, [isAdmin]);

  const loadRoadmapForCourse = useCallback(async (courseId) => {
    if (!courseId) return;
    setRoadmapLoading(true);
    setRoadmapMsg("");
    try {
      const doc = await getRoadmapByCourseId(courseId);
      if (doc?.modules?.length) {
        setModules(
          doc.modules.map((m, mi) => ({
            title: m.title || "",
            order: m.order ?? mi,
            lessons: (m.lessons || []).map((l, li) => ({
              key: l.key || "",
              title: l.title || "",
              order: l.order ?? li,
              description: l.description || "",
              durationMinutes: l.durationMinutes ?? 0,
              imageUrl: l.imageUrl || "",
              videoUrl: l.videoUrl || "",
              youtubeUrl: l.youtubeUrl || "",
            })),
          }))
        );
      } else {
        setModules([emptyModule(0)]);
      }
    } catch {
      setModules([emptyModule(0)]);
    } finally {
      setRoadmapLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "users" && isAdmin) loadUsers();
    if (tab === "site" && isAdmin) loadSite();
    if (tab === "roadmaps") {
      loadCourses();
      loadCategories();
    }
    if (tab === "enrollments" && isAdmin) loadEnrollments();
    if (tab === "payments" && isAdmin) loadPayments();
    if (tab === "overview" && isAdmin) loadOverview();
  }, [tab, isAdmin, loadUsers, loadSite, loadCourses, loadCategories, loadEnrollments, loadPayments, loadOverview]);

  useEffect(() => {
    if (tab === "roadmaps" && selectedCourseId) loadRoadmapForCourse(selectedCourseId);
  }, [tab, selectedCourseId, loadRoadmapForCourse]);

  useEffect(() => {
    if (tab === "courses" && selectedCourseId && courses.length) {
      const course = courses.find((item) => item.id === selectedCourseId || item._id === selectedCourseId);
      if (course) {
        setCourseForm({
          title: course.title || "",
          slug: course.slug || "",
          description: course.description || "",
          thumbnailUrl: course.thumbnailUrl || "",
          categoryId: course.categoryId?._id || course.categoryId?.id || "",
          level: course.level || "beginner",
          durationWeeks: course.durationWeeks || 8,
          basePrice: course.basePrice || 0,
          requiredSkills: serializeSkills(course.requiredSkills),
          formatsJson: JSON.stringify(course.formats || [], null, 2),
          isPublished: course.isPublished !== false,
        });
      }
    }
  }, [tab, selectedCourseId, courses]);

  const saveSite = async () => {
    setSiteMsg("");
    try {
      await updateSiteContent({
        heroTitle: site.heroTitle,
        heroSubtitle: site.heroSubtitle,
        heroImageUrl: site.heroImageUrl,
        consultationYoutubeUrl: site.consultationYoutubeUrl,
        faqs: site.faqs.map((f, i) => ({ question: f.question, answer: f.answer, order: f.order ?? i })),
        chatbotSuggestions: site.chatbotSuggestions.filter(Boolean),
      });
      setSiteMsg("Đã lưu nội dung tư vấn / FAQ.");
    } catch (error) {
      setSiteMsg(error.message || "Lưu thất bại.");
    }
  };

  const saveRoadmap = async () => {
    if (!selectedCourseId) return;
    setRoadmapMsg("");
    try {
      const normalized = modules.map((m, mi) => ({
        title: m.title || `Module ${mi + 1}`,
        order: m.order ?? mi,
        lessons: (m.lessons || []).map((l, li) => ({
          title: l.title || `Bài ${li + 1}`,
          key: l.key || "",
          order: l.order ?? li,
          description: l.description || "",
          durationMinutes: Number(l.durationMinutes) || 0,
          imageUrl: l.imageUrl || "",
          videoUrl: l.videoUrl || "",
          youtubeUrl: l.youtubeUrl || "",
        })),
      }));
      await putRoadmapApi(selectedCourseId, normalized);
      setRoadmapMsg("Đã lưu lộ trình.");
    } catch (error) {
      setRoadmapMsg(error.message || "Lưu lộ trình thất bại.");
    }
  };

  const patchUser = async (userId, body) => {
    setUserMsg("");
    try {
      await updateUserRole(userId, body);
      setUserMsg("Đã cập nhật tài khoản.");
      loadUsers();
    } catch (error) {
      setUserMsg(error.message || "Cập nhật thất bại.");
    }
  };

  const saveCourse = async () => {
    setCourseMsg("");
    try {
      const payload = {
        title: courseForm.title,
        slug: courseForm.slug || undefined,
        description: courseForm.description,
        thumbnailUrl: courseForm.thumbnailUrl,
        categoryId: courseForm.categoryId,
        level: courseForm.level,
        durationWeeks: Number(courseForm.durationWeeks) || 0,
        basePrice: Number(courseForm.basePrice) || 0,
        requiredSkills: parseSkills(courseForm.requiredSkills),
        formats: JSON.parse(courseForm.formatsJson || "[]"),
        isPublished: Boolean(courseForm.isPublished),
      };
      if (!payload.title || !payload.categoryId) {
        throw new Error("Vui lòng điền tiêu đề và danh mục.");
      }
      if (selectedCourseId) {
        await updateCourse(selectedCourseId, payload);
        setCourseMsg("Đã cập nhật khóa học.");
      } else {
        await createCourse(payload);
        setCourseMsg("Đã tạo khóa học mới.");
      }
      loadCourses();
    } catch (error) {
      setCourseMsg(error.message || "Lưu khóa học thất bại.");
    }
  };

  const patchEnrollment = async (enrollmentId, status) => {
    setEnrollmentsMsg("");
    try {
      await updateEnrollmentStatus(enrollmentId, { status });
      setEnrollmentsMsg("Đã cập nhật trạng thái ghi danh.");
      loadEnrollments();
    } catch (error) {
      setEnrollmentsMsg(error.message || "Cập nhật thất bại.");
    }
  };

  const patchPayment = async (paymentId, status) => {
    setPaymentsMsg("");
    try {
      await updatePaymentStatus(paymentId, { status });
      setPaymentsMsg("Đã cập nhật trạng thái thanh toán.");
      loadPayments();
    } catch (error) {
      setPaymentsMsg(error.message || "Cập nhật thất bại.");
    }
  };

  if (!user?.isLoggedIn || !canAccess) return null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-white pt-60 pb-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Quản trị</h1>
            <p className="mt-1 text-slate-600">
              {isAdmin
                ? "Quản lý tài khoản, khóa học, lộ trình, nội dung site, ghi danh và thanh toán."
                : "Cập nhật lộ trình khóa học."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("overview")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === "overview"
                  ? "bg-[var(--ws-primary)] text-white shadow-md"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              Tổng quan
            </button>
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setTab("users")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    tab === "users"
                      ? "bg-[var(--ws-primary)] text-white shadow-md"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Tài khoản
                </button>
                <button
                  type="button"
                  onClick={() => setTab("courses")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    tab === "courses"
                      ? "bg-[var(--ws-primary)] text-white shadow-md"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Khóa học
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => setTab("roadmaps")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                tab === "roadmaps"
                  ? "bg-[var(--ws-primary)] text-white shadow-md"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              Lộ trình
            </button>
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setTab("site")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    tab === "site"
                      ? "bg-[var(--ws-primary)] text-white shadow-md"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Nội dung site
                </button>
                <button
                  type="button"
                  onClick={() => setTab("enrollments")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    tab === "enrollments"
                      ? "bg-[var(--ws-primary)] text-white shadow-md"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Ghi danh
                </button>
                <button
                  type="button"
                  onClick={() => setTab("payments")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    tab === "payments"
                      ? "bg-[var(--ws-primary)] text-white shadow-md"
                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  Thanh toán
                </button>
              </>
            )}
          </div>
        </div>

        {tab === "overview" && isAdmin && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Bảng điều khiển tổng quan</h2>
                <p className="mt-1 text-sm text-slate-600">Tổng quan nhanh các số liệu quản trị.</p>
              </div>
              <button
                type="button"
                onClick={loadOverview}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Tải lại
              </button>
            </div>
            {overviewLoading ? (
              <p>Đang lấy dữ liệu tổng quan...</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Tài khoản</p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">{overviewCounts.users}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Khóa học</p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">{overviewCounts.courses}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Ghi danh</p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">{overviewCounts.enrollments}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Thanh toán</p>
                  <p className="mt-3 text-3xl font-bold text-slate-900">{overviewCounts.payments}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "users" && isAdmin && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/5">
            <div className="mb-4 flex flex-wrap gap-3">
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Tìm email / tên..."
                className="min-w-[200px] flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-[var(--ws-primary)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setUsersPage(1);
                  loadUsers();
                }}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Tìm
              </button>
            </div>
            {userMsg && <p className="mb-3 text-sm text-teal-800">{userMsg}</p>}
            {usersLoading ? (
              <p className="text-slate-600">Đang tải...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Họ tên</th>
                      <th className="py-2 pr-4">Vai trò</th>
                      <th className="py-2 pr-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-slate-100">
                        <td className="py-3 pr-4 font-medium text-slate-800">{u.email}</td>
                        <td className="py-3 pr-4 text-slate-600">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="py-3 pr-4">
                          <select
                            value={u.role}
                            onChange={(e) => patchUser(u.id, { role: e.target.value })}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 pr-4">
                          <label className="inline-flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={u.isActive !== false}
                              onChange={(e) => patchUser(u.id, { isActive: e.target.checked })}
                            />
                            Hoạt động
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "site" && isAdmin && (
          <div className="space-y-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg">
            {siteMsg && <p className="text-sm text-teal-800">{siteMsg}</p>}
            {siteLoading ? (
              <p>Đang tải...</p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-slate-700">
                    Tiêu đề hero
                    <input
                      value={site.heroTitle}
                      onChange={(e) => setSite((s) => ({ ...s, heroTitle: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Ảnh nền hero (URL)
                    <input
                      value={site.heroImageUrl}
                      onChange={(e) => setSite((s) => ({ ...s, heroImageUrl: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </label>
                </div>
                <label className="block text-sm font-semibold text-slate-700">
                  Mô tả hero
                  <textarea
                    value={site.heroSubtitle}
                    onChange={(e) => setSite((s) => ({ ...s, heroSubtitle: e.target.value }))}
                    rows={2}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Link YouTube tư vấn (trang FAQ)
                  <input
                    value={site.consultationYoutubeUrl}
                    onChange={(e) => setSite((s) => ({ ...s, consultationYoutubeUrl: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">FAQ</span>
                    <button
                      type="button"
                      onClick={() =>
                        setSite((s) => ({
                          ...s,
                          faqs: [...s.faqs, { question: "", answer: "", order: s.faqs.length }],
                        }))
                      }
                      className="text-sm font-semibold text-[var(--ws-primary)]"
                    >
                      + Thêm câu hỏi
                    </button>
                  </div>
                  <div className="space-y-3">
                    {site.faqs.map((f, i) => (
                      <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                        <input
                          value={f.question}
                          onChange={(e) => {
                            const faqs = [...site.faqs];
                            faqs[i] = { ...faqs[i], question: e.target.value };
                            setSite((s) => ({ ...s, faqs }));
                          }}
                          placeholder="Câu hỏi"
                          className="mb-2 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                        />
                        <textarea
                          value={f.answer}
                          onChange={(e) => {
                            const faqs = [...site.faqs];
                            faqs[i] = { ...faqs[i], answer: e.target.value };
                            setSite((s) => ({ ...s, faqs }));
                          }}
                          placeholder="Trả lời"
                          rows={2}
                          className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <label className="block text-sm font-semibold text-slate-700">
                  Gợi ý chatbot (mỗi dòng một gợi ý)
                  <textarea
                    value={site.chatbotSuggestions.join("\n")}
                    onChange={(e) =>
                      setSite((s) => ({
                        ...s,
                        chatbotSuggestions: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean),
                      }))
                    }
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-sm"
                  />
                </label>
                <button
                  type="button"
                  onClick={saveSite}
                  className="rounded-xl bg-gradient-to-r from-[var(--ws-primary)] to-[var(--ws-primary-strong)] px-6 py-3 font-semibold text-white shadow-md"
                >
                  Lưu nội dung
                </button>
              </>
            )}
          </div>
        )}

        {tab === "courses" && isAdmin && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg">
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Quản lý khóa học</h2>
                <p className="mt-1 text-sm text-slate-600">Tạo, chỉnh sửa và cập nhật thông tin khóa học.</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCourseForm({
                      title: "",
                      slug: "",
                      description: "",
                      thumbnailUrl: "",
                      categoryId: "",
                      level: "beginner",
                      durationWeeks: 8,
                      basePrice: 0,
                      requiredSkills: "",
                      formatsJson: JSON.stringify([{ formatType: "online", priceOverride: 0, isActive: true }], null, 2),
                      isPublished: true,
                    });
                    setSelectedCourseId("");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Tạo khóa học mới
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loadCourses();
                    loadCategories();
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Tải lại
                </button>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_1.3fr]">
              <div className="rounded-3xl border border-slate-200 p-5">
                <label className="block text-sm font-semibold text-slate-700">
                  Chọn khóa học để chỉnh sửa
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <option value="">-- Chọn khóa học --</option>
                    {courses.map((course) => (
                      <option key={course.id || course._id} value={course.id || course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="mt-5 space-y-3">
                  {courses.slice(0, 8).map((course) => (
                    <button
                      key={course.id || course._id}
                      type="button"
                      onClick={() => setSelectedCourseId(course.id || course._id)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span>{course.title}</span>
                        <span className="text-xs text-slate-500">{course.isPublished ? "Hiện" : "Ẩn"}</span>
                      </div>
                      <p className="text-xs text-slate-500">{course.categoryId?.name || "Không rõ"}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 p-5">
                {courseMsg && <p className="mb-4 text-sm text-teal-800">{courseMsg}</p>}
                <div className="grid gap-4">
                  <label className="block text-sm font-semibold text-slate-700">
                    Tiêu đề
                    <input
                      value={courseForm.title}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Slug
                    <input
                      value={courseForm.slug}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, slug: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Mô tả
                    <textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      Ảnh thumbnail (URL)
                      <input
                        value={courseForm.thumbnailUrl}
                        onChange={(e) => setCourseForm((prev) => ({ ...prev, thumbnailUrl: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Danh mục
                      <select
                        value={courseForm.categoryId}
                        onChange={(e) => setCourseForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                      >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((category) => (
                          <option key={category.id || category._id} value={category.id || category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="block text-sm font-semibold text-slate-700">
                      Cấp độ
                      <select
                        value={courseForm.level}
                        onChange={(e) => setCourseForm((prev) => ({ ...prev, level: e.target.value }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                      >
                        {COURSE_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Thời lượng (tuần)
                      <input
                        type="number"
                        value={courseForm.durationWeeks}
                        onChange={(e) => setCourseForm((prev) => ({ ...prev, durationWeeks: Number(e.target.value) }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-slate-700">
                      Giá cơ bản
                      <input
                        type="number"
                        value={courseForm.basePrice}
                        onChange={(e) => setCourseForm((prev) => ({ ...prev, basePrice: Number(e.target.value) }))}
                        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                      />
                    </label>
                  </div>
                  <label className="block text-sm font-semibold text-slate-700">
                    Kỹ năng yêu cầu (phân tách bằng dấu phẩy)
                    <input
                      value={courseForm.requiredSkills}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, requiredSkills: e.target.value }))}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Định dạng khóa học (JSON)
                    <textarea
                      value={courseForm.formatsJson}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, formatsJson: e.target.value }))}
                      rows={5}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                    />
                  </label>
                  <label className="inline-flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={courseForm.isPublished}
                      onChange={(e) => setCourseForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                    />
                    Hiển thị khóa học
                  </label>
                  <button
                    type="button"
                    onClick={saveCourse}
                    className="rounded-2xl bg-[var(--ws-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--ws-primary-strong)]"
                  >
                    {selectedCourseId ? "Cập nhật khóa học" : "Tạo khóa học"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "roadmaps" && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg">
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Lộ trình khóa học</h2>
                <p className="mt-1 text-sm text-slate-600">Cập nhật module và bài học cho khóa học.</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    loadCourses();
                    loadCategories();
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Tải lại khóa học
                </button>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
              <div className="rounded-3xl border border-slate-200 p-5">
                <label className="block text-sm font-semibold text-slate-700">
                  Chọn khóa học lộ trình
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2"
                  >
                    <option value="">-- Chọn khóa học --</option>
                    {courses.map((course) => (
                      <option key={course.id || course._id} value={course.id || course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="rounded-3xl border border-slate-200 p-5">
                {roadmapMsg && <p className="mb-3 text-sm text-teal-800">{roadmapMsg}</p>}
                {roadmapLoading ? (
                  <p>Đang tải lộ trình...</p>
                ) : (
                  <>
                    {modules.map((module, mi) => (
                      <div key={mi} className="mb-4 rounded-3xl border border-slate-200 p-4">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                          <label className="block w-full max-w-[calc(100%-120px)] text-sm font-semibold text-slate-700">
                            Tiêu đề module
                            <input
                              value={module.title}
                              onChange={(e) => {
                                const next = [...modules];
                                next[mi] = { ...module, title: e.target.value };
                                setModules(next);
                              }}
                              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => setModules((prev) => prev.filter((_, idx) => idx !== mi))}
                            className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                          >
                            Xóa module
                          </button>
                        </div>
                        {module.lessons.map((lesson, li) => (
                          <div key={li} className="mb-3 rounded-xl border border-white bg-white p-3 shadow-sm">
                            <input
                              value={lesson.title}
                              onChange={(e) => {
                                const next = [...modules];
                                const lessons = [...next[mi].lessons];
                                lessons[li] = { ...lessons[li], title: e.target.value };
                                next[mi] = { ...next[mi], lessons };
                                setModules(next);
                              }}
                              placeholder="Tên bài học"
                              className="mb-2 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                            />
                            <div className="grid gap-2 sm:grid-cols-2">
                              <input
                                value={lesson.youtubeUrl}
                                onChange={(e) => {
                                  const next = [...modules];
                                  const lessons = [...next[mi].lessons];
                                  lessons[li] = { ...lessons[li], youtubeUrl: e.target.value };
                                  next[mi] = { ...next[mi], lessons };
                                  setModules(next);
                                }}
                                placeholder="YouTube URL"
                                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                              />
                              <input
                                value={lesson.videoUrl}
                                onChange={(e) => {
                                  const next = [...modules];
                                  const lessons = [...next[mi].lessons];
                                  lessons[li] = { ...lessons[li], videoUrl: e.target.value };
                                  next[mi] = { ...next[mi], lessons };
                                  setModules(next);
                                }}
                                placeholder="Video URL"
                                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                              />
                              <input
                                value={lesson.imageUrl}
                                onChange={(e) => {
                                  const next = [...modules];
                                  const lessons = [...next[mi].lessons];
                                  lessons[li] = { ...lessons[li], imageUrl: e.target.value };
                                  next[mi] = { ...next[mi], lessons };
                                  setModules(next);
                                }}
                                placeholder="Ảnh URL"
                                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                              />
                              <input
                                type="number"
                                value={lesson.durationMinutes}
                                onChange={(e) => {
                                  const next = [...modules];
                                  const lessons = [...next[mi].lessons];
                                  lessons[li] = { ...lessons[li], durationMinutes: Number(e.target.value) };
                                  next[mi] = { ...next[mi], lessons };
                                  setModules(next);
                                }}
                                placeholder="Phút"
                                className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                              />
                            </div>
                            <textarea
                              value={lesson.description}
                              onChange={(e) => {
                                const next = [...modules];
                                const lessons = [...next[mi].lessons];
                                lessons[li] = { ...lessons[li], description: e.target.value };
                                next[mi] = { ...next[mi], lessons };
                                setModules(next);
                              }}
                              placeholder="Mô tả ngắn"
                              rows={2}
                              className="mt-2 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const next = [...modules];
                                next[mi] = {
                                  ...next[mi],
                                  lessons: next[mi].lessons.filter((_, idx) => idx !== li),
                                };
                                setModules(next);
                              }}
                              className="mt-2 text-xs font-semibold text-red-600"
                            >
                              Xóa bài học
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const next = [...modules];
                            next[mi] = {
                              ...next[mi],
                              lessons: [...next[mi].lessons, emptyLesson(next[mi].lessons.length)],
                            };
                            setModules(next);
                          }}
                          className="text-sm font-semibold text-[var(--ws-primary)]"
                        >
                          + Bài học trong module
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setModules((prev) => [...prev, emptyModule(prev.length)])}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Thêm module mới
                    </button>
                    <button
                      type="button"
                      onClick={saveRoadmap}
                      className="rounded-2xl bg-[var(--ws-primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--ws-primary-strong)]"
                    >
                      Lưu lộ trình
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {tab === "enrollments" && isAdmin && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg">
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Quản lý ghi danh</h2>
                <p className="mt-1 text-sm text-slate-600">Xem và cập nhật trạng thái ghi danh học viên.</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <select
                  value={enrollmentStatus}
                  onChange={(e) => setEnrollmentStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Tất cả trạng thái</option>
                  {ENROLLMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={loadEnrollments}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Tải lại
                </button>
              </div>
            </div>
            {enrollmentsMsg && <p className="mb-3 text-sm text-teal-800">{enrollmentsMsg}</p>}
            {enrollmentsLoading ? (
              <p>Đang tải ghi danh...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-4">Học viên</th>
                      <th className="py-2 pr-4">Khóa học</th>
                      <th className="py-2 pr-4">Tổng phí</th>
                      <th className="py-2 pr-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map((item) => (
                      <tr key={item.id || item._id} className="border-b border-slate-100">
                        <td className="py-3 pr-4 text-slate-700">{item.userId?.email || item.userId?.id || item.userId}</td>
                        <td className="py-3 pr-4 text-slate-700">{item.courseId?.title || item.courseId?.name || "Không rõ"}</td>
                        <td className="py-3 pr-4 text-slate-700">{item.finalPrice?.toLocaleString()} VND</td>
                        <td className="py-3 pr-4">
                          <select
                            value={item.status}
                            onChange={(e) => patchEnrollment(item.id || item._id, e.target.value)}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                          >
                            {ENROLLMENT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "payments" && isAdmin && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-lg">
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Quản lý thanh toán</h2>
                <p className="mt-1 text-sm text-slate-600">Xem và cập nhật trạng thái giao dịch.</p>
              </div>
              <div className="flex items-center justify-end gap-2">
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Tất cả trạng thái</option>
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={loadPayments}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Tải lại
                </button>
              </div>
            </div>
            {paymentsMsg && <p className="mb-3 text-sm text-teal-800">{paymentsMsg}</p>}
            {paymentsLoading ? (
              <p>Đang tải thanh toán...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-2 pr-4">Mã</th>
                      <th className="py-2 pr-4">Khóa học</th>
                      <th className="py-2 pr-4">Số tiền</th>
                      <th className="py-2 pr-4">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((item) => (
                      <tr key={item.id || item._id} className="border-b border-slate-100">
                        <td className="py-3 pr-4 text-slate-700">{item.providerRef || item.id || item._id}</td>
                        <td className="py-3 pr-4 text-slate-700">{item.enrollmentId?.courseId?.title || "Không rõ"}</td>
                        <td className="py-3 pr-4 text-slate-700">{item.amount?.toLocaleString()} VND</td>
                        <td className="py-3 pr-4">
                          <select
                            value={item.status}
                            onChange={(e) => patchPayment(item.id || item._id, e.target.value)}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-sm"
                          >
                            {PAYMENT_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
