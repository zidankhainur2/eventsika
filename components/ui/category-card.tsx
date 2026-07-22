import React from "react";
import { 
  Presentation, 
  Hammer, 
  Trophy, 
  Palette, 
  Dumbbell, 
  Laptop, 
  BookOpen, 
  Users 
} from "lucide-react";

import Link from "next/link";

interface CategoryCardProps {
  categoryKey: string;
  label: string;
  onClick?: () => void;
  href?: string;
}

function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const iconMap: Record<string, React.ComponentType<any>> = {
    "seminar": Presentation,
    "workshop": Hammer,
    "kompetisi": Trophy,
    "seni-budaya": Palette,
    "olahraga": Dumbbell,
    "teknologi": Laptop,
    "pengembangan-diri": BookOpen,
    "sosial": Users,
  };

  const IconComponent = iconMap[name.toLowerCase()] || Presentation;
  return <IconComponent className={className} />;
}

export default function CategoryCard({ categoryKey, label, onClick, href }: CategoryCardProps) {
  const className = "flex flex-col items-center justify-center text-center gap-2.5 p-4 bg-[#CDF22B] border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] transition-all duration-100 hover:shadow-[2px_2px_0px_#0A0A0A] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] w-full";

  if (href) {
    return (
      <Link href={href} className={className}>
        <CategoryIcon name={categoryKey} className="w-10 h-10 text-[#0A0A0A]" />
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#0A0A0A]">
          {label}
        </span>
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick}
      className={className}
    >
      <CategoryIcon name={categoryKey} className="w-10 h-10 text-[#0A0A0A]" />
      <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#0A0A0A]">
        {label}
      </span>
    </button>
  );
}
