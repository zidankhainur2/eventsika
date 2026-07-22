import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getOrganizerEvents } from '@/modules/events/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

import type { OrganizerStats } from '@/types';
import EventStatusBadge from '@/components/dashboard/EventStatusBadge';

export const metadata: Metadata = {
  title: 'Dashboard Organizer — EventSika',
};

export default async function OrganizerDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify organizer role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  if (!profile || (profile.role !== 'organizer' && profile.role !== 'admin' && profile.role !== 'super_admin')) {
    redirect('/');
  }

  if (profile.role === 'admin' || profile.role === 'super_admin') {
    redirect('/admin');
  }

  const events = await getOrganizerEvents(user.id);

  // Calculate stats server-side
  const stats: OrganizerStats = {
    total: events.length,
    published: events.filter((e) => e.status === 'published').length,
    pending: events.filter((e) => e.status === 'pending').length,
    rejected: events.filter((e) => e.status === 'rejected').length,
    draft: events.filter((e) => e.status === 'draft').length,
  };  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-tight text-[#0A0A0A]">Dashboard</h1>
          <p className="text-[#6B6B6B] mt-1 font-medium">
            Selamat datang, {profile.full_name}! Kelola event Anda di sini.
          </p>
        </div>
        <Button asChild variant="primary">
          <Link href="/dashboard/submit-event">
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            Buat Event Baru
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-[#6B6B6B] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0A0A0A]" aria-hidden="true" />
              Total Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-[#0A0A0A]">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-[#6B6B6B] flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#16A34A]" aria-hidden="true" />
              Dipublikasikan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-[#16A34A]">{stats.published}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-[#6B6B6B] flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#CA8A04]" aria-hidden="true" />
              Menunggu Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-[#CA8A04]">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-extrabold uppercase tracking-wider text-[#6B6B6B] flex items-center gap-2">
              <XCircle className="h-4 w-4 text-[#DC2626]" aria-hidden="true" />
              Ditolak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-[#DC2626]">{stats.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Events Table */}
      <Card className="border-2 border-[#0A0A0A] rounded-xl shadow-[4px_4px_0px_#0A0A0A] bg-white overflow-hidden">
        <CardHeader className="border-b-2 border-[#0A0A0A] bg-[#F7F7F5] py-4">
          <CardTitle className="text-lg font-extrabold uppercase tracking-tight text-[#0A0A0A]">
            Daftar Event Saya
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {events.length === 0 ? (
            <div className="text-center py-12 text-[#6B6B6B] px-4">
              <FileText className="h-12 w-12 mx-auto mb-4 text-[#E8E8E8]" aria-hidden="true" />
              <p className="font-extrabold uppercase tracking-wide text-sm">Belum ada event</p>
              <p className="text-xs mt-1">Buat event pertama Anda untuk memulai.</p>
              <Button
                asChild
                variant="primary"
                className="mt-4"
              >
                <Link href="/dashboard/submit-event">Buat Event</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#0A0A0A] bg-[#F7F7F5]">
                    <th className="text-left py-3 px-4 font-extrabold uppercase tracking-wider text-xs text-[#0A0A0A]">
                      Judul Event
                    </th>
                    <th className="text-left py-3 px-4 font-extrabold uppercase tracking-wider text-xs text-[#0A0A0A] hidden md:table-cell">
                      Kategori
                    </th>
                    <th className="text-left py-3 px-4 font-extrabold uppercase tracking-wider text-xs text-[#0A0A0A] hidden sm:table-cell">
                      Tanggal
                    </th>
                    <th className="text-left py-3 px-4 font-extrabold uppercase tracking-wider text-xs text-[#0A0A0A]">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 font-extrabold uppercase tracking-wider text-xs text-[#0A0A0A]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-[#E8E8E8] last:border-b-0 hover:bg-[#F7F7F5] transition-colors"
                    >
                      <td className="py-4 px-4 font-bold text-[#0A0A0A]">
                        <p className="line-clamp-1">
                          {event.title}
                        </p>
                        {event.status === 'rejected' && event.rejection_reason && (
                          <p className="text-xs text-[#DC2626] font-medium mt-0.5 line-clamp-1">
                            Alasan: {event.rejection_reason}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-4 text-[#6B6B6B] font-semibold hidden md:table-cell">
                        {event.category}
                      </td>
                      <td className="py-4 px-4 text-[#6B6B6B] font-semibold hidden sm:table-cell">
                        {new Date(event.start_date || event.date || '').toLocaleDateString(
                          'id-ID',
                          { day: 'numeric', month: 'short', year: 'numeric' }
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <EventStatusBadge status={event.status} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          {event.status === 'published' && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/event/${event.slug}`}>Lihat</Link>
                            </Button>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/events/${event.id}/edit`}>Edit</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
