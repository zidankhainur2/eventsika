// components/Searchbar.tsx
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
    <div className="relative w-full max-w-xs lg:max-w-md">
      <FiSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
      <Input
        type="text"
        placeholder="Cari event..."
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("search")?.toString()}
        className="pl-10 !py-2 !mt-0"
      />
    </div>
  );
}
