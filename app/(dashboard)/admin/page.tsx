import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import {
  getAdminStats,
  getPendingApplications,
} from '@/modules/admin/actions';
import { getPendingEvents } from '@/modules/events/queries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Calendar, Building, AlertCircle } from 'lucide-react';

import AdminEventRow from './AdminEventRow';
import AdminApplicationRow from './AdminApplicationRow';

export const metadata: Metadata = {
  title: 'Admin Center — EventSika',
};

export default async function AdminDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin' && profile?.role !== 'super_admin') redirect('/');

  // Parallel data fetching for maximum performance
  const [stats, pendingEvents, pendingApplications] = await Promise.all([
    getAdminStats(),
    getPendingEvents(),
    getPendingApplications(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Center</h1>
        <p className="text-gray-500 mt-1">
          Kelola platform, moderasi event, dan verifikasi organizer.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="h-4 w-4" aria-hidden="true" />
              Total Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              Total Event
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Building className="h-4 w-4" aria-hidden="true" />
              Total Organizer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrganizers}</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              Menunggu Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-700">
              {stats.pendingEvents + stats.pendingApplications}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Events Moderation */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Event Menunggu Persetujuan
          </CardTitle>
          <CardDescription>
            Tinjau setiap event sebelum dipublikasikan kepada mahasiswa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingEvents.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Tidak ada event yang perlu ditinjau saat ini. ✅
            </p>
          ) : (
            <div className="space-y-3">
              {pendingEvents.map((event) => (
                <AdminEventRow key={event.id} event={event} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organizer Application Management */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Pengajuan Organizer Tertunda
          </CardTitle>
          <CardDescription>
            Tinjau dan setujui atau tolak aplikasi organizer di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingApplications.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              Tidak ada pengajuan organizer yang perlu ditinjau saat ini. ✅
            </p>
          ) : (
            <div className="space-y-3">
              {pendingApplications.map((app) => (
                <AdminApplicationRow key={app.id} application={app} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
