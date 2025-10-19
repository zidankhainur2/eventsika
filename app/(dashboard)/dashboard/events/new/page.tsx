import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EventForm from "@/app/(dashboard)/submit-event/EventForm";
import { addEvent } from "@/app/action";

export default function NewEventPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-heading font-bold">
          Buat Event Baru
        </CardTitle>
        <CardDescription>
          Isi detail di bawah ini untuk mempublikasikan event-mu.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EventForm formAction={addEvent} buttonText="Submit Event" />
      </CardContent>
    </Card>
  );
}
