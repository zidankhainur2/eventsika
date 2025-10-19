import { Button } from "@/components/ui/button";
import Link from "next/link";
import EventsDataTable from "../EventsDataTable";


export default function ManageEventsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold">Kelola Event</h1>
          <p className="text-muted-foreground">
            Buat, edit, atau hapus event Anda di sini.
          </p>
        </div>
        <Button asChild>
          <Link href="/submit-event">Buat Event Baru</Link>
        </Button>
      </div>
      <EventsDataTable />
    </div>
  );
}
