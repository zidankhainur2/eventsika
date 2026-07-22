"use client";

import { useState, useTransition } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MapPin, Clock, Send, MessageSquare } from "lucide-react";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama lengkap wajib diisi";
    if (!formData.email.trim()) {
      newErrors.email = "Alamat email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subjek pesan wajib diisi";
    if (!formData.message.trim()) newErrors.message = "Isi pesan tidak boleh kosong";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Pesan Terkirim!", {
        description: "Terima kasih atas masukan Anda. Kami akan segera menghubungi Anda.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 my-8 items-start">
      {/* Info Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Card 1: Email */}
        <Card className="p-6 border-border rounded-2xl shadow-sm flex gap-4 bg-card text-card-foreground">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Email</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Kirim pesan langsung ke tim pengembang kami.
            </p>
            <a
              href="mailto:support@eventsika.com"
              className="text-sm font-semibold text-primary hover:underline mt-2 inline-block"
            >
              support@eventsika.com
            </a>
          </div>
        </Card>

        {/* Card 2: Alamat */}
        <Card className="p-6 border-border rounded-2xl shadow-sm flex gap-4 bg-card text-card-foreground">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Lokasi</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Fakultas Ilmu Komputer, Universitas Singaperbangsa Karawang.
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Jl. HS. Ronggowaluyo, Telukjambe Timur, Karawang, Jawa Barat.
            </p>
          </div>
        </Card>

        {/* Card 3: Waktu Layanan */}
        <Card className="p-6 border-border rounded-2xl shadow-sm flex gap-4 bg-card text-card-foreground">
          <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Jam Kerja</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Tim kami aktif merespons masukan pada jam berikut.
            </p>
            <p className="text-sm font-medium text-foreground mt-2">
              Senin - Jumat: 08:00 - 16:00 WIB
            </p>
          </div>
        </Card>
      </div>

      {/* Form Column */}
      <Card className="lg:col-span-3 p-6 sm:p-8 border-border rounded-3xl shadow-sm bg-card text-card-foreground">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-4 mb-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Formulir Kontak</h2>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-muted-foreground">
              Nama Lengkap
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`h-11 rounded-xl border-border bg-background ${
                errors.name ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
              placeholder="Masukkan nama Anda"
            />
            {errors.name && <p className="text-xs text-destructive font-semibold">{errors.name}</p>}
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-muted-foreground">
              Alamat Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`h-11 rounded-xl border-border bg-background ${
                errors.email ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
              placeholder="email@mahasiswa.unsika.ac.id"
            />
            {errors.email && <p className="text-xs text-destructive font-semibold">{errors.email}</p>}
          </div>

          {/* Subject Input */}
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-semibold text-muted-foreground">
              Subjek
            </Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className={`h-11 rounded-xl border-border bg-background ${
                errors.subject ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
              placeholder="Topik atau subjek pesan Anda"
            />
            {errors.subject && <p className="text-xs text-destructive font-semibold">{errors.subject}</p>}
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold text-muted-foreground">
              Pesan
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              className={`rounded-xl border-border bg-background ${
                errors.message ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
              placeholder="Tuliskan pesan, saran, atau masukan Anda di sini..."
            />
            {errors.message && <p className="text-xs text-destructive font-semibold">{errors.message}</p>}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Kirim Pesan
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
