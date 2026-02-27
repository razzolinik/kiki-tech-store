import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Page transition: fade out → scroll → fade in
  useEffect(() => {
    setTransitioning(true);
    window.scrollTo({ top: 0, behavior: "instant" });

    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Show/hide back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Page fade overlay */}
      <div
        className={`fixed inset-0 z-[9999] bg-background pointer-events-none transition-opacity duration-300 ${
          transitioning ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        aria-label="Volver arriba"
        className={`
          fixed bottom-6 right-6 z-50
          w-12 h-12 rounded-full
          flex items-center justify-center
          shadow-hover
          transition-all duration-500 ease-out
          ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-90 pointer-events-none"
          }
        `}
        style={{
          background: "var(--gradient-button)",
        }}
      >
        <ArrowUp className="h-5 w-5 text-white" strokeWidth={2.5} />
      </button>
    </>
  );
};

export default ScrollToTop;