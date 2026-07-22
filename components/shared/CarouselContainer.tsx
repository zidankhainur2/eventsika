"use client";

import { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CarouselContainerProps {
  children: React.ReactNode;
}

export default function CarouselContainer({ children }: CarouselContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  // Set up listeners once on mount
  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  // Re-check when children update
  useEffect(() => {
    checkScroll();
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = clientWidth * 0.75;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel w-full">
      {/* Left Arrow Button */}
      <button
        onClick={() => scroll("left")}
        className={`hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#CDF22B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0A0A0A] transition-all duration-200 ${
          showLeftArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll left"
      >
        <FiChevronLeft className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Right Arrow Button */}
      <button
        onClick={() => scroll("right")}
        className={`hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-white text-[#0A0A0A] shadow-[3px_3px_0px_#0A0A0A] hover:bg-[#CDF22B] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#0A0A0A] transition-all duration-200 ${
          showRightArrow ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll right"
      >
        <FiChevronRight className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar relative z-10 scroll-smooth"
      >
        {children}
      </div>
    </div>
  );
}
