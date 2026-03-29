// components/InterestSelector.tsx
// User memilih PARENT topics (bukan child tags)
// Ini yang disimpan ke profiles.interests

"use client";

import { PARENT_TOPICS, TOPIC_TAXONOMY } from "@/lib/taxonomy";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface InterestSelectorProps {
  value: string[]; // Array of selected parent topics
  onChange: (interests: string[]) => void;
  maxSelections?: number;
}

export function InterestSelector({
  value = [],
  onChange,
  maxSelections = 5,
}: InterestSelectorProps) {
  const toggleInterest = (topic: string) => {
    if (value.includes(topic)) {
      onChange(value.filter((t) => t !== topic));
    } else if (value.length < maxSelections) {
      onChange([...value, topic]);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Pilih bidang yang Anda minati (maks. {maxSelections}). Sistem akan
        merekomendasikan event yang relevan dengan minat Anda.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PARENT_TOPICS.map((topic) => {
          const isSelected = value.includes(topic);
          const previewTags = TOPIC_TAXONOMY[topic].slice(0, 3);

          return (
            <button
              key={topic}
              type="button"
              onClick={() => toggleInterest(topic)}
              className={cn(
                "text-left rounded-lg border p-3 transition-all hover:border-primary",
                isSelected
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-background",
                value.length >= maxSelections && !isSelected
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer",
              )}
              disabled={value.length >= maxSelections && !isSelected}
            >
              <div className="font-medium text-sm mb-1">{topic}</div>
              <div className="text-xs text-muted-foreground">
                {previewTags.join(", ")}
                {TOPIC_TAXONOMY[topic].length > 3 && ", ..."}
              </div>
              {isSelected && (
                <Badge className="mt-2 text-xs" variant="default">
                  Dipilih ✓
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {value.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Dipilih: <strong>{value.join(", ")}</strong>
        </div>
      )}
    </div>
  );
}
