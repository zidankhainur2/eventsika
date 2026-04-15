"use client";

import { CATEGORIES } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const activeCategories = new Set(
    searchParams.get("category")?.split(",") || [],
  );

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    const newActiveCategories = new Set(activeCategories);

    if (newActiveCategories.has(category)) {
      newActiveCategories.delete(category);
    } else {
      newActiveCategories.add(category);
    }

    if (newActiveCategories.size > 0) {
      params.set("category", Array.from(newActiveCategories).join(","));
    } else {
      params.delete("category");
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
        {/* Tombol Reset "All" */}
        <button
          onClick={handleClearFilters}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
            activeCategories.size === 0
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700"
          }`}
        >
          Semua
        </button>

        {CATEGORIES.map((cat) => {
          const isActive = activeCategories.has(cat);
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
