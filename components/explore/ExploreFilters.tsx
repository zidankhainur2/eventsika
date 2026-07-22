'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useDebounce } from 'use-debounce';

const CATEGORIES = [
  'Seminar',
  'Workshop',
  'Kompetisi',
  'Webinar',
  'Pameran',
  'Sosial',
  'Seni & Budaya',
  'Olahraga',
  'Akademik',
];

const SORT_OPTIONS = [
  { value: 'upcoming', label: 'Segera Hadir' },
  { value: 'newest', label: 'Terbaru' },
  { value: 'popular', label: 'Terpopuler' },
];

interface ExploreFiltersProps {
  initialQuery: string;
  initialCategory: string;
  initialSort: string;
}

export default function ExploreFilters({
  initialQuery,
  initialCategory,
  initialSort,
}: ExploreFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [debouncedQuery] = useDebounce(query, 400);

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString());
    const newParams = new URLSearchParams();

    if (debouncedQuery) {
      newParams.set('q', debouncedQuery);
    }
    if (category) {
      newParams.set('category', category);
    }
    if (sort && sort !== 'upcoming') {
      newParams.set('sort', sort);
    }

    const currentStr = currentParams.toString();
    const newStr = newParams.toString();

    // Sort parameters to ensure reliable comparison regardless of key order
    const sortedCurrent = new URLSearchParams(currentStr);
    sortedCurrent.sort();
    const sortedNew = new URLSearchParams(newStr);
    sortedNew.sort();

    if (sortedCurrent.toString() !== sortedNew.toString()) {
      router.push(`/explore?${newStr}`, { scroll: false });
    }
  }, [debouncedQuery, category, sort, router, searchParams]);

  const handleCategoryToggle = (cat: string) => {
    setCategory((prev) => (prev === cat ? '' : cat));
  };

  const handleClearAll = () => {
    setQuery('');
    setCategory('');
    setSort('upcoming');
    router.push('/explore', { scroll: false });
    setIsMobileOpen(false);
  };

  const hasActiveFilters = query || category || sort !== 'upcoming';

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Urutkan</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full h-10 px-3 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Urutkan event"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-foreground">Kategori</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors',
                category === cat
                  ? 'bg-primary text-primary-foreground border-transparent'
                  : 'bg-background text-foreground border-border hover:border-primary hover:text-primary'
              )}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={handleClearAll}
        >
          <X className="h-4 w-4 mr-2" />
          Reset Filter
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile view top bar */}
      <div className="md:hidden space-y-4 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari event..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-10 bg-background"
            />
          </div>
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 h-10 w-10">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
              <SheetHeader className="mb-4">
                <SheetTitle>Filter Event</SheetTitle>
              </SheetHeader>
              <FilterContent />
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Active chips on mobile */}
        {category && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {category}
              <button onClick={() => setCategory('')} className="hover:text-primary/70">
                <X className="h-3 w-3" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Desktop view sidebar content */}
      <div className="hidden md:block space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari event, organizer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 bg-background"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <FilterContent />
      </div>
    </>
  );
}
