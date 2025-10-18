import { Card } from "@/components/ui/card";
import { addEvent } from "../action";
import EventForm from "./EventForm";

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
        <EventForm formAction={addEvent} buttonText="Submit Event" />
      </Card>
    </main>
  );
}
