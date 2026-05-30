import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import CoursesSection from "../components/CourseSecsion";
import TrustBar from "../components/TrustBar";
import Testimonials from "../components/Testimonials";
import CTASection from "../components/CTASection";
import CourseSearchSection from "../components/CourseSearchSection";
import ConsultChatbot from "../components/ConsultChatbot";
import TrackCard from "../components/TrackCard";
import { getAllTracks } from "../constants/tracks";
import { getSiteContent } from "../services/siteContentService";

function Home() {
  const [chatFaqs, setChatFaqs] = useState([]);
  const [chatSuggestions, setChatSuggestions] = useState([]);
  const tracks = getAllTracks();

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const doc = await getSiteContent();
        if (!ok || !doc) return;
        const faqs = (doc.faqs || [])
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((f) => ({ question: f.question, answer: f.answer }));
        setChatFaqs(faqs);
        setChatSuggestions(Array.isArray(doc.chatbotSuggestions) ? doc.chatbotSuggestions : []);
      } catch {
        // Dùng FAQ mặc định trong chatbot.
      }
    })();
    return () => {
      ok = false;
    };
  }, []);

  return (
    <main className="overflow-x-hidden">
      <Hero />
      <CourseSearchSection />

      <section className="py-16">
        <div className="ws-section">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ws-primary-strong)]">Structured paths</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] text-[var(--ws-ink)] md:text-4xl">Ba nhóm lộ trình chính để đi từ định hướng tới đăng ký.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-[var(--ws-ink-soft)]">
              Khối lựa chọn được thiết kế lại theo card density thấp hơn, typography rõ hơn và có điểm nhấn theo từng nhóm nghề thay vì trải màu dàn hàng.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {tracks.map((track) => (
              <TrackCard key={track.id} trackId={track.id} />
            ))}
          </div>
        </div>
      </section>

      <TrustBar />
      <CoursesSection />
      <Testimonials />
      <CTASection />
      <ConsultChatbot faqs={chatFaqs} suggestions={chatSuggestions} />
    </main>
  );
}

export default Home;
