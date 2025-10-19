import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getEventBySlug } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EventForm from "@/app/(dashboard)/submit-event/EventForm";
import { updateEvent } from "@/app/action";

type EditEventPageProps = {
  params: { slug: string };
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const event = await getEventBySlug(params.slug);

  if (event.organizer_id !== user.id) {
    redirect("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-heading font-bold">
          Edit Event: {event.title}
        </CardTitle>
        <CardDescription>Perbarui detail acaramu di sini.</CardDescription>
      </CardHeader>
      <CardContent>
        <EventForm
          formAction={updateEvent}
          event={event}
          buttonText="Simpan Perubahan"
        />
      </CardContent>
    </Card>
  );
}
