// app/submit-event/page.tsx
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { addEvent } from "../action";

const CATEGORIES = [
  "Seminar", "Workshop", "Lomba", "Webinar", "Konser", "Olahraga"
];

export default function SubmitEventPage() {
  return (
    <main className="py-8 sm:py-12">
      <Card className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Submit Event Baru
        </h1>

        <form action={addEvent} className="space-y-6">
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
            <Input type="url" name="image_url" id="image_url" placeholder="https://" />
          </div>
          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select name="category" id="category" required defaultValue="">
              <option value="" disabled>Pilih kategori...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>
           <div>
            <Label htmlFor="location">Lokasi</Label>
            <Input type="text" name="location" id="location" required placeholder="Contoh: Gedung Fasilkom / Online"/>
          </div>
          <div>
            <Label htmlFor="event_date">Tanggal & Waktu</Label>
            <Input type="datetime-local" name="event_date" id="event_date" required />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea name="description" id="description" required />
          </div>
          <div>
            <Label htmlFor="registration_link">Link Pendaftaran</Label>
            <Input type="url" name="registration_link" id="registration_link" required placeholder="https://" />
          </div>
          <div>
            <Button type="submit">Submit Event</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}