import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/animations.css";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import ScrollToTop from "./components/ScrollToTop";
import ToastContainer from "./components/ToastContainer";
import Home from "./pages/home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Blog from "./pages/Blog";
import Mentor from "./pages/Mentor";
import About from "./pages/About";
import Business from "./pages/Business";
import Roadmap from "./pages/Roadmap";
import Learn from "./pages/Learn";
import FAQ from "./pages/FAQ";
import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import CourseRegistration from "./pages/CourseRegistration";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";
import { initializeAuth } from "./services/authService";

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      await initializeAuth();
      if (isMounted) {
        setAuthReady(true);
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--ws-page)]">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[var(--ws-primary)]"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/mentor" element={<Mentor />} />
        <Route path="/about" element={<About />} />
        <Route path="/business" element={<Business />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/learn/:courseId" element={<Learn />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register/:courseId" element={<CourseRegistration />} />
        <Route path="/payment/:courseId" element={<Payment />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
