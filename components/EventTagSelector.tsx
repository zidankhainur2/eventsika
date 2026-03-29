// components/EventTagSelector.tsx
// Komponen dropdown untuk input tag event berbasis taxonomy
// Menggantikan input bebas dengan pilihan terstruktur

"use client";

import { useState, useMemo } from "react";
import { TOPIC_TAXONOMY, ALL_TAGS } from "@/lib/taxonomy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FiChevronDown, FiX } from "react-icons/fi";

interface EventTagSelectorProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

export function EventTagSelector({
  value = [],
  onChange,
  maxTags = 5,
}: EventTagSelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleTag = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else if (value.length < maxTags) {
      onChange([...value, tag]);
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      {/* Selected tags display */}
      <div className="flex flex-wrap gap-2 min-h-9 p-2 border rounded-md bg-background">
        {value.length === 0 && (
          <span className="text-muted-foreground text-sm self-center">
            Pilih tag (maks. {maxTags})
          </span>
        )}
        {value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-destructive"
            >
              <FiX className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* Popover picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            type="button"
            disabled={value.length >= maxTags}
            className="w-full justify-between"
          >
            {value.length >= maxTags
              ? `Maks. ${maxTags} tag tercapai`
              : "Tambah tag dari daftar..."}
            <FiChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Cari tag..." />
            <CommandList>
              <CommandEmpty>Tag tidak ditemukan.</CommandEmpty>
              {/* Tampilkan tags dikelompokkan berdasarkan parent taxonomy */}
              {Object.entries(TOPIC_TAXONOMY).map(([parent, childTags]) => (
                <CommandGroup key={parent} heading={parent}>
                  {childTags.map((tag) => (
                    <CommandItem
                      key={tag}
                      value={tag}
                      onSelect={() => toggleTag(tag)}
                      className="cursor-pointer"
                    >
                      <span
                        className={
                          value.includes(tag)
                            ? "font-semibold text-primary"
                            : ""
                        }
                      >
                        {tag}
                      </span>
                      {value.includes(tag) && (
                        <span className="ml-auto text-primary">✓</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Info taxonomy untuk admin */}
      <p className="text-xs text-muted-foreground">
        Tag dikelompokkan berdasarkan kategori topik. Pilih tag yang paling
        sesuai dengan konten event Anda.
      </p>
    </div>
  );
}
