// src/components/SearchFilter.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const CATEGORIES = [
  "Seminar",
  "Workshop",
  "Lomba",
  "Webinar",
  "Konser",
  "Olahraga",
];

export default function SearchFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Debounce callback untuk mengurangi jumlah request saat user mengetik
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); // Tunggu 300ms setelah user berhenti mengetik

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4">
      <input
        type="text"
        placeholder="Cari nama event..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("search")?.toString()}
        className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
      />
      <select
        onChange={(e) => handleCategoryChange(e.target.value)}
        defaultValue={searchParams.get("category")?.toString()}
        className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
      >
        <option value="">Semua Kategori</option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
