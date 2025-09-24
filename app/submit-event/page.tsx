"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { addEvent } from "../action";

const CATEGORIES = [
  "Seminar",
  "Workshop",
  "Lomba",
  "Webinar",
  "Konser",
  "Olahraga",
];

// 🔧 Definisikan tipe FormState
type FormState = {
  message: string;
  type: "success" | "error" | null;
};

// 🔧 initialState harus sesuai FormState
const initialState: FormState = {
  message: "",
  type: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Mengirim..." : "Submit Event"}
    </Button>
  );
}

export default function SubmitEventPage() {
  // 🔧 Tambah generic agar state sesuai FormState
  const [state, formAction] = useActionState<FormState, FormData>(
    addEvent,
    initialState
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <main className="py-8 sm:py-12">
      <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Submit Event Baru</h1>
          <p className="text-neutral-dark/70 mt-2">
            Bagikan acaramu kepada seluruh mahasiswa!
          </p>
        </div>

        <form action={formAction} className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="font-semibold text-lg text-primary mb-2">
              Informasi Dasar
            </legend>
            <div>
              <Label htmlFor="title">Nama Event</Label>
              <Input type="text" name="title" id="title" required />
            </div>
            <div>
              <Label htmlFor="organizer">Penyelenggara</Label>
              <Input type="text" name="organizer" id="organizer" required />
            </div>
            <div>
              <Label htmlFor="image_file">Gambar Poster</Label>
              <Input
                type="file"
                name="image_file"
                id="image_file"
                required
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
              <Select name="category" id="category" required defaultValue="">
                <option value="" disabled>
                  Pilih kategori...
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Input
                type="text"
                name="location"
                id="location"
                required
                placeholder="Contoh: Gedung Fasilkom / Online"
              />
            </div>
            <div>
              <Label htmlFor="event_date">Tanggal & Waktu</Label>
              <Input
                type="datetime-local"
                name="event_date"
                id="event_date"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea name="description" id="description" required />
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
              />
            </div>
          </fieldset>

          {state?.message && (
            <p
              className={`text-sm p-3 rounded-md ${
                state.type === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {state.message}
            </p>
          )}

          <div className="pt-4">
            <SubmitButton />
          </div>
        </form>
      </Card>
    </main>
  );
}
