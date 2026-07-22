"use client";

import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import { useProfile } from "@/lib/hooks/useEvents";
import { Skeleton } from "@/components/ui/skeleton";

function ProfileFormSkeleton() {
  return (
    <div className="space-y-8 animate-pulse p-6 md:p-8">
      {/* Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />

        {/* Avatar Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 w-full space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>

        {/* Input Fields Skeleton */}
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Skeleton className="h-10 w-full sm:w-40" />
        <Skeleton className="h-10 w-full sm:w-24" />
      </div>
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
    <div className="divide-y divide-border">
      {/* Header Section */}
      <div className="p-6 md:p-8 bg-muted/30">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Informasi Pribadi
          </h2>
          <p className="text-sm text-muted-foreground">
            Perbarui foto profil dan data diri Anda di sini.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-6 md:p-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
