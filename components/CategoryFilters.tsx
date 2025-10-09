"use client";

import { CATEGORIES } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Ambil kategori aktif dari URL dan ubah menjadi Set untuk kemudahan manipulasi
  const activeCategories = new Set(
    searchParams.get("category")?.split(",") || []
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

    replace(`${pathname}?${params.toString()}`);
  };

  // 🔹 Fungsi untuk menghapus semua filter
  const handleClearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category"); // hapus parameter kategori dari URL
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="my-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategories.has(cat);
          return (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-white text-neutral-dark hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          );
        })}

        {/* 🔹 Tombol Clear Filter muncul hanya jika ada filter aktif */}
        {activeCategories.size > 0 && (
          <button
            onClick={handleClearFilters}
            className="ml-2 px-4 py-2 text-sm font-semibold rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            Hapus Filter
          </button>
        )}
      </div>
    </section>
  );
}
