// app/submit-event/page.tsx
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

export default function SubmitEventPage() {
  return (
    <main className="py-8 sm:py-12">
      <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Submit Event Baru</h1>
          <p className="text-neutral-dark/70 mt-2">
            Bagikan acaramu kepada seluruh mahasiswa!
          </p>
        </div>

        <form action={addEvent} className="space-y-8">
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
              <Label htmlFor="image_url">URL Gambar Poster</Label>
              <Input
                type="url"
                name="image_url"
                id="image_url"
                placeholder="https://"
              />
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

          <div className="pt-4">
            <Button type="submit">Submit Event</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
