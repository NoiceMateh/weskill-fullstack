import { useMemo, useState } from "react";
import { blogPosts, blogCategories } from "../data/blogData";
import { PLACEHOLDER_COURSE_IMAGE } from "../assets/placeholders";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredPosts = useMemo(() => {
    let filtered = [...blogPosts];

    if (activeCategory !== "all") {
      filtered = filtered.filter((post) => post.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          post.author.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "popular") {
        const scoreA = (a.featured ? 100 : 0) + (a.id % 50);
        const scoreB = (b.featured ? 100 : 0) + (b.id % 50);
        return scoreB - scoreA;
      }
      return 0;
    });

    return filtered;
  }, [activeCategory, searchQuery, sortBy]);

  const featuredPosts = blogPosts.filter((post) => post.featured).slice(0, 2);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-[var(--ws-page)] pt-24">
      <section className="bg-gradient-to-br from-[var(--ws-primary)] to-[var(--ws-primary-strong)] py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-white/85">Blog và tin tức</p>
          <h1 className="text-4xl font-extrabold md:text-5xl">Kiến thức công nghệ và kinh doanh</h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90">
            Cập nhật xu hướng, kinh nghiệm và bài học thực tế từ cộng đồng học viên và mentor WeSkill.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-[var(--ws-ink)]">Bài viết nổi bật</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredPosts.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-2xl border border-[var(--ws-border)] bg-white shadow-sm">
              <img src={post.image || PLACEHOLDER_COURSE_IMAGE} alt={post.title} className="h-52 w-full object-cover" />
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full bg-[var(--ws-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--ws-primary-strong)]">
                    {blogCategories.find((cat) => cat.id === post.category)?.name}
                  </span>
                  <span className="text-xs text-[var(--ws-muted)]">{post.readTime}</span>
                </div>
                <h3 className="line-clamp-2 text-lg font-bold text-[var(--ws-ink)]">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--ws-muted)]">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sticky top-20 z-10 border-y border-[var(--ws-border)] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {blogCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  activeCategory === category.id
                    ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)] text-[var(--ws-primary-strong)]"
                    : "border-[var(--ws-border)] bg-white text-[var(--ws-muted)] hover:bg-[var(--ws-page)]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm focus:border-[var(--ws-primary)] focus:outline-none"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-[var(--ws-border)] px-3 py-2 text-sm text-[var(--ws-ink)] focus:border-[var(--ws-primary)] focus:outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="popular">Phổ biến</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-xl border border-[var(--ws-border)] bg-white">
                <img src={post.image || PLACEHOLDER_COURSE_IMAGE} alt={post.title} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <span className="text-xs font-semibold text-[var(--ws-primary-strong)]">
                    {blogCategories.find((cat) => cat.id === post.category)?.name}
                  </span>
                  <h3 className="mt-2 line-clamp-2 font-bold text-[var(--ws-ink)]">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--ws-muted)]">{post.excerpt}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-[var(--ws-muted)]">
                    <span>{post.author}</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--ws-border)] bg-white p-10 text-center">
            <p className="text-sm text-[var(--ws-muted)]">Không tìm thấy bài viết phù hợp bộ lọc hiện tại.</p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
                setSortBy("newest");
              }}
              className="mt-4 rounded-lg bg-[var(--ws-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--ws-primary-strong)]"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

