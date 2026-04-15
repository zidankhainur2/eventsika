"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { FiSearch } from "react-icons/fi";
import { Input } from "./ui/input";

export default function Searchbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    replace(`/?${params.toString()}`);
  }, 300);

  return (
    <div className="relative w-full">
      <FiSearch className="absolute top-1/2 -translate-y-1/2 left-4 text-stone-400 text-lg" />
      <Input
        type="text"
        placeholder="Cari event, workshop, atau kompetisi..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("search")?.toString()}
        className="pl-12 py-5 rounded-full bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm hover:border-primary/50 focus-visible:ring-primary focus-visible:ring-offset-0 text-sm font-medium transition-colors"
      />
    </div>
  );
}
