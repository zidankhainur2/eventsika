"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useOrganizerEvents } from "@/lib/hooks/useEvents";

export default function OrganizerDashboard() {
  const { events, isLoading } = useOrganizerEvents();

  const totalEvents = events.length;
  const upcomingEvents = events.filter(
    (event) => new Date(event.event_date) > new Date()
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold">Ringkasan</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali! Berikut adalah ringkasan singkat event Anda.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : totalEvents}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Event Mendatang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : upcomingEvents}
            </div>
          </CardContent>
        </Card>
        {/* Placeholder untuk analitik di masa depan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Pendaftar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
          </CardContent>
        </Card>
      </div>
      {/* Di sini nanti kita bisa tambahkan komponen tabel untuk event terbaru */}
    </div>
  );
}
