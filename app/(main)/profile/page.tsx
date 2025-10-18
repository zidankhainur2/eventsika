"use client";

import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { useProfile } from "@/lib/hooks/useEvents";

function ProfileFormSkeleton() {
  return (
    <div className="space-y-6 mt-6 animate-pulse p-8">
      <div className="h-8 w-1/3 bg-gray-200 rounded-md"></div>
      <div className="h-24 w-full bg-gray-200 rounded-md"></div>
      <div className="h-12 w-full bg-gray-200 rounded-md"></div>
      <div className="h-12 w-full bg-gray-200 rounded-md"></div>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return <ProfileFormSkeleton />;
  }

  if (!profile) {
    return redirect("/login");
  }

  return (
    <div>
      <div className="p-6 sm:p-8">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Informasi Akun
        </h1>
        <p className="text-text-secondary mt-1">
          Perbarui foto, nama, dan preferensi personalisasimu di sini.
        </p>
      </div>
      <div className="p-6 sm:p-8 border-t">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
