"use client";

import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { CATEGORIES, MAJORS } from "@/lib/constants";
import { type Event } from "@/lib/types";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Memproses..." : text}
    </Button>
  );
}

interface EventFormProps {
  formAction: (
    prevState: any,
    formData: FormData
  ) => Promise<FormState & { slug?: string }>;
  event?: Event | null;
  buttonText: string;
}

type FormState = {
  message: string;
  type: "success" | "error" | null;
};

const initialState: FormState = {
  message: "",
  type: null,
};

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

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await formAction(null, formData);
      if (result.type === "error") {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      toast.success("Berhasil!", { description: data.message });

      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });

      if (event) {
        router.push("/organizer/dashboard");
      } else {
        router.push(`/event/${data.slug}`);
      }
      router.refresh();
    },
    onError: (error) => {
      toast.error("Gagal", { description: error.message });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutate(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(event?.image_url || null);
    }
  };

  // Fungsi untuk memformat tanggal ke YYYY-MM-DDTHH:MM
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

      <fieldset className="space-y-4">
        <legend className="font-semibold text-lg text-primary mb-2">
          Informasi Dasar
        </legend>
        <div>
          <Label htmlFor="title">Nama Event</Label>
          <Input
            type="text"
            name="title"
            id="title"
            required
            defaultValue={event?.title}
          />
        </div>
        <div>
          <Label htmlFor="organizer">Penyelenggara</Label>
          <Input
            type="text"
            name="organizer"
            id="organizer"
            required
            defaultValue={event?.organizer}
          />
        </div>
        <div>
          <Label htmlFor="image_file">Gambar Poster</Label>
          <Input
            type="file"
            name="image_file"
            id="image_file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {imagePreview && (
            <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden border">
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

      <fieldset className="space-y-4">
        <legend className="font-semibold text-lg text-primary mb-2">
          Detail Acara
        </legend>
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Select
            defaultValue={event?.category || ""}
            onValueChange={(value) => {
              const hiddenInput = document.querySelector<HTMLInputElement>(
                "input[name='category']"
              );
              if (hiddenInput) hiddenInput.value = value;
            }}
          >
            <SelectTrigger className="w-full">
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
          <input
            type="hidden"
            name="category"
            value={event?.category || ""}
            readOnly
          />
        </div>
        <div>
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
        <div>
          <Label htmlFor="event_date">Tanggal & Waktu</Label>
          <Input
            type="datetime-local"
            name="event_date"
            id="event_date"
            required
            defaultValue={event ? formatDateTimeLocal(event.event_date) : ""}
          />
        </div>
        <div>
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
        <legend className="font-semibold text-lg text-primary mb-2">
          Target Audiens
        </legend>
        <p className="text-sm text-gray-600 -mt-2">
          Pilih {"Umum"} atau tentukan jurusan spesifik.
        </p>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="umum"
              name="target_majors"
              type="checkbox"
              value="Umum"
              defaultChecked={!event || event.target_majors?.includes("Umum")}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="umum" className="ml-3">
              Umum (Semua Jurusan)
            </Label>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">atau</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto rounded-lg border p-4">
          {MAJORS.map((major) => (
            <div key={major} className="flex items-center">
              <input
                id={major}
                name="target_majors"
                type="checkbox"
                value={major}
                defaultChecked={event?.target_majors?.includes(major)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor={major} className="ml-3">
                {major}
              </Label>
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-semibold text-lg text-primary mb-2">
          Pendaftaran
        </legend>
        <div>
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
        <Button type="submit" disabled={isPending}>
          {isPending ? "Memproses..." : buttonText}
        </Button>
      </div>
    </form>
  );
}
