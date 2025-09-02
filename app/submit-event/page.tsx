// src/app/submit-event/page.tsx
import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const supabase = createClient();

export default function SubmitEventPage() {
  // Ini adalah Server Action. Fungsi ini akan berjalan di server, bukan di browser.
  async function addEvent(formData: FormData) {
    "use server"; // Wajib ada untuk menandakan ini Server Action

    // 1. Mengambil data dari form
    const eventData = {
      title: formData.get("title") as string,
      organizer: formData.get("organizer") as string,
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      event_date: formData.get("event_date") as string,
      description: formData.get("description") as string,
      registration_link: formData.get("registration_link") as string,
    };

    // 2. Mengirim data ke tabel 'events' di Supabase
    const { error } = await supabase.from("events").insert([eventData]);

    if (error) {
      // Di dunia nyata, kita akan menampilkan error yang lebih baik
      console.error("Error inserting data:", error);
      return;
    }

    // 3. Membersihkan cache halaman utama agar event baru langsung muncul
    revalidatePath("/");

    // 4. Mengarahkan pengguna kembali ke halaman utama setelah berhasil
    redirect("/");
  }

  return (
    <main className="bg-neutral-light min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-primary mb-6">
          Submit Event Baru
        </h1>

        {/* Hubungkan form dengan Server Action 'addEvent' */}
        <form action={addEvent} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral-dark"
            >
              Nama Event
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            />
          </div>

          {/* Tambahkan field lain seperti ini */}
          <div>
            <label
              htmlFor="organizer"
              className="block text-sm font-medium text-neutral-dark"
            >
              Penyelenggara
            </label>
            <input
              type="text"
              name="organizer"
              id="organizer"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-neutral-dark"
            >
              Kategori
            </label>
            <input
              type="text"
              name="category"
              id="category"
              required
              placeholder="Contoh: Seminar, Workshop, Lomba"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-neutral-dark"
            >
              Lokasi
            </label>
            <input
              type="text"
              name="location"
              id="location"
              required
              placeholder="Contoh: Gedung Fasilkom / Online"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label
              htmlFor="event_date"
              className="block text-sm font-medium text-neutral-dark"
            >
              Tanggal & Waktu
            </label>
            <input
              type="datetime-local"
              name="event_date"
              id="event_date"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-dark"
            >
              Deskripsi
            </label>
            <textarea
              name="description"
              id="description"
              rows={5}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="registration_link"
              className="block text-sm font-medium text-neutral-dark"
            >
              Link Pendaftaran
            </label>
            <input
              type="url"
              name="registration_link"
              id="registration_link"
              required
              placeholder="https://"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition-colors"
            >
              Submit Event
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
