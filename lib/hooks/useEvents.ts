"use client";

import { useQuery } from "@tanstack/react-query";
import { type Profile } from "@/lib/types";
import * as queries from "@/lib/queries";

export function useEvents(search: string, category: string) {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: queries.getUser,
  });

  const {
    data: upcomingEvents = [],
    isLoading: isUpcomingLoading,
    error: upcomingError,
  } = useQuery({
    queryKey: ["events", "upcoming", { search, category }],
    queryFn: () => queries.getAllUpcomingEvents({ search, category }),
  });

  const {
    data: recommendedEvents = [],
    isLoading: isRecommendedLoading,
    error: recommendedError,
  } = useQuery({
    queryKey: ["events", "recommended"],
    queryFn: queries.getRecommendedEvents,
    enabled: !!user,
  });

  const {
    data: majorEvents = [],
    isLoading: isMajorLoading,
    error: majorError,
  } = useQuery({
    queryKey: ["events", "major"],
    queryFn: queries.getMajorRelatedEvents,
    enabled: !!user,
  });

  const {
    data: savedEventIds = new Set<string>(),
    isLoading: isSavedIdsLoading,
  } = useQuery({
    queryKey: ["savedEvents"],
    queryFn: queries.getSavedEventIds,
    enabled: !!user,
  });

  return {
    user,
    upcomingEvents,
    recommendedEvents,
    majorEvents,
    savedEventIds,
    isLoading:
      isUserLoading ||
      isUpcomingLoading ||
      isRecommendedLoading ||
      isMajorLoading ||
      isSavedIdsLoading,
    error: upcomingError || recommendedError || majorError,
  };
}

export function useEventBySlug(slug: string | null) {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: queries.getUser,
  });

  const { data: savedEventIds = new Set<string>() } = useQuery({
    queryKey: ["savedEvents"],
    queryFn: queries.getSavedEventIds,
    enabled: !!user,
  });

  const {
    data: event,
    isLoading: isEventLoading,
    error: eventError,
  } = useQuery({
    queryKey: ["event", slug],
    queryFn: () => queries.getEventBySlug(slug!),
    enabled: !!slug,
  });

  const { data: relatedEvents = [], isLoading: isRelatedLoading } = useQuery({
    queryKey: ["events", "related", event?.category, event?.id],
    queryFn: () => queries.getRelatedEvents(event!.category, event!.id),
    enabled: !!event,
  });

  const isSaved = !!event && savedEventIds.has(event.id);
  const isLoading = isEventLoading || isRelatedLoading;

  return { event, user, isSaved, relatedEvents, isLoading, error: eventError };
}

export function useOrganizerEvents() {
  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organizer-events"],
    queryFn: queries.getEventsByOrganizer,
  });

  return { events, isLoading, error };
}

export function useProfile() {
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: queries.getProfile,
  });

  return { profile, isLoading, error };
}

export function useSavedEvents() {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: queries.getUser,
  });

  const {
    data: events = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["savedEvents", "details"],
    queryFn: queries.getSavedEvents,
    enabled: !!user,
  });

  return { events, user, isLoading, error };
}
