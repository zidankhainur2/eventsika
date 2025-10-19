"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { type Event } from "@/lib/types";
import { type FormState } from "@/app/(types)/FormState";
import { CATEGORIES, MAJORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventFormProps {
  formAction: (
    prevState: any,
    formData: FormData
  ) => Promise<FormState & { slug?: string }>;
  event?: Event | null;
  buttonText: string;
}

export default function EventForm({
  formAction,
  event = null,
  buttonText,
}: EventFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(
    event?.image_url || null
  );

  const [category, setCategory] = useState<string>(event?.category || "");
  const [targetMajors, setTargetMajors] = useState<string[]>(
    event?.target_majors || ["Umum"]
  );

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await formAction(null, formData);
      if (result.type === "error") throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      toast.success("Berhasil!", { description: data.message });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
      router.push(event ? "/dashboard/events" : `/event/${data.slug}`);
      router.refresh();
    },
    onError: (error) => {
      toast.error("Gagal", { description: error.message });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    formData.set("category", category);
    formData.delete("target_majors");
    targetMajors.forEach((major) => formData.append("target_majors", major));

    mutate(formData);
  };

  const handleMajorChange = (major: string, checked: boolean) => {
    setTargetMajors((prev) => {
      if (major === "Umum") {
        return checked ? ["Umum"] : [];
      }
      const newMajors = prev.filter((m) => m !== "Umum");
      if (checked) {
        return [...newMajors, major];
      } else {
        return newMajors.filter((m) => m !== major);
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(event?.image_url || null);
    }
  };

  const formatDateTimeLocal = (isoString: string) => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {event && <input type="hidden" name="id" value={event.id} />}
      {event && (
        <input
          type="hidden"
          name="current_image_url"
          value={event.image_url || ""}
        />
      )}

      <fieldset className="space-y-6">
        <legend className="font-heading text-xl font-semibold text-text-primary">
          Informasi Dasar
        </legend>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="title">Nama Event</Label>
          <Input
            type="text"
            name="title"
            id="title"
            required
            defaultValue={event?.title}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="organizer">Penyelenggara</Label>
          <Input
            type="text"
            name="organizer"
            id="organizer"
            required
            defaultValue={event?.organizer}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="image_file">Gambar Poster</Label>
          <Input
            type="file"
            name="image_file"
            id="image_file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-4 relative w-full aspect-video rounded-lg overflow-hidden border">
              <Image
                src={imagePreview}
                alt="Pratinjau Poster"
                fill
                className="object-contain"
              />
            </div>
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="font-heading text-xl font-semibold text-text-primary">
          Detail Acara
        </legend>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="category">Kategori</Label>
          <Select
            name="category"
            value={category}
            onValueChange={setCategory}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Pilih kategori..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="location">Lokasi</Label>
          <Input
            type="text"
            name="location"
            id="location"
            required
            placeholder="Contoh: Gedung Fasilkom / Online"
            defaultValue={event?.location}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="event_date">Tanggal & Waktu</Label>
          <Input
            type="datetime-local"
            name="event_date"
            id="event_date"
            required
            defaultValue={event ? formatDateTimeLocal(event.event_date) : ""}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea
            name="description"
            id="description"
            required
            defaultValue={event?.description}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-heading text-xl font-semibold text-text-primary">
          Target Audiens
        </legend>
        <p className="text-sm text-muted-foreground -mt-2">
          Pilih &quot;Umum&quot; atau tentukan jurusan spesifik.
        </p>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="umum"
            checked={targetMajors.includes("Umum")}
            onCheckedChange={(checked) => handleMajorChange("Umum", !!checked)}
          />
          <Label htmlFor="umum" className="font-medium">
            Umum (Semua Jurusan)
          </Label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 rounded-lg border p-4">
          {MAJORS.map((major) => (
            <div key={major} className="flex items-center space-x-2">
              <Checkbox
                id={major}
                checked={targetMajors.includes(major)}
                onCheckedChange={(checked) =>
                  handleMajorChange(major, !!checked)
                }
                disabled={targetMajors.includes("Umum") && major !== "Umum"}
              />
              <Label
                htmlFor={major}
                className={cn(
                  "transition-colors",
                  targetMajors.includes("Umum") &&
                    major !== "Umum" &&
                    "text-muted-foreground"
                )}
              >
                {major}
              </Label>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="font-heading text-xl font-semibold text-text-primary">
          Pendaftaran
        </legend>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="registration_link">Link Pendaftaran</Label>
          <Input
            type="url"
            name="registration_link"
            id="registration_link"
            required
            placeholder="https://"
            defaultValue={event?.registration_link}
          />
        </div>
      </fieldset>

      <div className="pt-4">
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Memproses..." : buttonText}
        </Button>
      </div>
    </form>
  );
}
