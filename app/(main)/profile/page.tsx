"use client";

import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { useProfile } from "@/lib/hooks/useEvents";

function ProfileFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-7 sm:h-8 w-48 bg-gray-200 rounded-md"></div>
        <div className="h-4 w-full max-w-md bg-gray-200 rounded-md"></div>
      </div>

      {/* Section Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="h-6 w-40 bg-gray-200 rounded-md"></div>

        {/* Avatar Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-24 w-24 sm:h-20 sm:w-20 bg-gray-200 rounded-full"></div>
          <div className="flex-1 w-full space-y-2">
            <div className="h-10 w-full bg-gray-200 rounded-md"></div>
            <div className="h-3 w-48 bg-gray-200 rounded-md"></div>
          </div>
        </div>

        {/* Input Fields Skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-full bg-gray-200 rounded-md"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-full bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="h-10 w-full sm:w-40 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-full sm:w-24 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <ProfileFormSkeleton />
      </div>
    );
  }

  if (!profile) {
    return redirect("/login");
  }

  return (
    <div className="divide-y">
      {/* Header Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-text-primary">
            Informasi Akun
          </h1>
          <p className="text-sm sm:text-base text-text-secondary">
            Perbarui foto, nama, dan preferensi personalisasimu di sini.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-4 sm:p-6 lg:p-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
