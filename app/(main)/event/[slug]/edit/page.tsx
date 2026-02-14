import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getEventBySlug } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { updateEvent } from "@/app/action";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import EventForm from "@/app/(dashboard)/submit-event/EventForm";

type EditEventPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { slug } = await params;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const event = await getEventBySlug(slug);

  if (event.organizer_id !== user.id) {
    redirect("/dashboard");
  }

  return (
    <main className="py-8 sm:py-12">
      <Card className="max-w-2xl mx-auto">
        <Link
          href="/organizer/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-6"
        >
          <FiArrowLeft />
          Kembali ke Dasbor
        </Link>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Edit Event</h1>
          <p className="text-neutral-dark/70 mt-2">
            Perbarui detail acaramu di sini.
          </p>
        </div>
        <EventForm
          formAction={updateEvent}
          event={event}
          buttonText="Simpan Perubahan"
        />
      </Card>
    </main>
  );
}
