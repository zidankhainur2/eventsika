import EventForm from "./EventForm";
import { addEvent } from "@/app/action";

export default function SubmitEventPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-heading font-bold">Buat Event Baru</h1>
        <p className="text-muted-foreground">
          Isi detail di bawah ini untuk mempublikasikan event-mu.
        </p>
      </div>
      <div className="bg-card p-6 rounded-lg border">
        <EventForm formAction={addEvent} buttonText="Submit Event" />
      </div>
    </div>
  );
}
