"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ApplicationActions } from "./ApplicationActions";
import { useAdminData } from "@/lib/hooks/useEvents";

export default function AdminDashboardPage() {
  const { applications, isLoading, error } = useAdminData();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-heading font-bold">Admin Center</h1>
        <p className="text-muted-foreground">
          Persetujuan untuk aplikasi organizer.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pengajuan Organizer Tertunda</CardTitle>
          <CardDescription>
            Tinjau dan setujui atau tolak aplikasi di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Memuat aplikasi...</p>
          ) : error ? (
            <p className="text-destructive">Gagal memuat data.</p>
          ) : applications.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Tidak ada pengajuan yang perlu ditinjau saat ini.
            </p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">{app.organization_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Email: {app.email}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Kontak: {app.contact_person}
                    </p>
                  </div>
                  <ApplicationActions
                    applicationId={app.id}
                    userId={app.user_id}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
