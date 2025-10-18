import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { FiSearch, FiTag } from "react-icons/fi";
import { CATEGORIES } from "@/lib/constants";

export default function SearchFilter() {
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
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category && category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row gap-4 items-center">
      {/* Input Pencarian */}
      <div className="relative w-full flex-grow">
        <FiSearch className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" />
        <Input
          type="text"
          placeholder="Cari nama event..."
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("search")?.toString() ?? ""}
          className="pl-10 !mt-0"
        />
      </div>

      {/* Select Kategori */}
      <div className="relative w-full sm:w-auto">
        <FiTag className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 z-10" />
        <Select
          onValueChange={handleCategoryChange}
          defaultValue={searchParams.get("category")?.toString() ?? "all"}
        >
          <SelectTrigger className="pl-10 w-full sm:w-[200px]">
            <SelectValue placeholder="Pilih kategori..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
