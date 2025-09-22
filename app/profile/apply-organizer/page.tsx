"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { submitOrganizerApplication } from "@/app/action";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { useActionState } from "react";

// PERBAIKAN: initialState tidak boleh langsung 'success'
const initialState = {
  message: "",
  type: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} variant="accent">
      {pending ? "Mengirim..." : "Kirim Pengajuan"}
    </Button>
  );
}

export default function ApplyOrganizerPage() {
  const [state, formAction] = useActionState(
    submitOrganizerApplication,
    initialState
  );

  return (
    <main className="py-8 sm:py-12">
      <Card className="max-w-2xl mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-6"
        >
          <FiArrowLeft />
          Kembali ke Profil
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">
            Formulir Pengajuan Organizer
          </h1>
          <p className="text-neutral-dark/70 mt-2">
            Isi detail berikut untuk diverifikasi oleh tim kami.
          </p>
        </div>

        {/* PERBAIKAN: Tampilkan pesan sukses hanya jika ada pesan */}
        {state?.type === "success" && state.message ? (
          <div className="text-center p-4 bg-green-100 text-green-800 rounded-lg">
            <h2 className="font-semibold">Pengajuan Terkirim!</h2>
            <p className="mt-1 text-sm">{state.message}</p>
          </div>
        ) : (
          <form action={formAction} className="space-y-6">
            <div>
              <Label htmlFor="organization_name">
                Nama Organisasi/UKM/Himpunan
              </Label>
              <Input
                type="text"
                name="organization_name"
                id="organization_name"
                required
                placeholder="Contoh: BEM Fasilkom Unsika"
              />
            </div>
            <div>
              <Label htmlFor="contact_person">
                Kontak Penanggung Jawab (No. HP/Email)
              </Label>
              <Input
                type="text"
                name="contact_person"
                id="contact_person"
                required
                placeholder="Kontak aktif yang bisa dihubungi"
              />
            </div>

            {state?.type === "error" && (
              <p className="text-sm p-3 rounded-md bg-red-100 text-red-700">
                {state.message}
              </p>
            )}

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        )}
      </Card>
    </main>
  );
}
