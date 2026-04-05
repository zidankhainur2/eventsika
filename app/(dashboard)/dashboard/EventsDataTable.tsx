"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiMoreHorizontal, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

import { type Event } from "@/lib/types";
import { useOrganizerEvents } from "@/lib/hooks/useEvents";
import { deleteEvent } from "@/app/action";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function EventActions({ event }: { event: Event }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: async (eventId: string) => {
      const result = await deleteEvent(eventId);
      if (result.type === "error") {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: (data) => {
      toast.success("Berhasil!", { description: data.message });
      queryClient.invalidateQueries({ queryKey: ["organizer-events"] });
    },
    onError: (error) => {
      toast.error("Gagal Menghapus", { description: error.message });
    },
    onSettled: () => {
      setIsDeleteDialogOpen(false);
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <FiMoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/events/${event.slug}/edit`}>
              <FiEdit className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive"
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            <span>Hapus</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Event &quot;{event.title}
              &quot; akan dihapus secara permanen dari server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutate(event.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Fungsi ini memformat tanggal agar ringkas di dalam tabel
function formatTableDate(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startStr = startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const endStr = endDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (startStr === endStr) {
    return startStr; // Jika 1 hari, cukup tampilkan: 5 Okt 2025
  }

  // Jika beda hari, tampilkan rentang: 5 Okt - 7 Okt 2025
  const startDayMonth = startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
  return `${startDayMonth} - ${endStr}`;
}

// Fungsi status yang lebih pintar (mendukung Berlangsung/Ongoing)
function getEventStatus(
  startDate: string,
  endDate: string,
): {
  text: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now > end) {
    return { text: "Selesai", variant: "secondary" };
  } else if (now >= start && now <= end) {
    return { text: "Berlangsung", variant: "default" }; // Bisa diganti warnanya jika punya varian khusus
  } else {
    return { text: "Mendatang", variant: "outline" };
  }
}

export default function EventsDataTable() {
  const { events, isLoading, error } = useOrganizerEvents();

  if (isLoading) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        Memuat data event...
      </div>
    );
  }

  if (error) {
    return (
      <div className="border rounded-lg p-8 text-center text-destructive">
        Gagal memuat data: {error.message}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        Anda belum membuat event apapun.
      </div>
    );
  }

  return (
    <>
      {/* --- Tampilan Desktop (Tabel) --- */}
      <div className="hidden md:block">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Nama Event</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                // Gunakan start_date dan end_date
                const status = getEventStatus(event.start_date, event.end_date);
                return (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      {/* Gunakan fungsi format yang baru */}
                      {formatTableDate(event.start_date, event.end_date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.text}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <EventActions event={event} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* --- Tampilan Mobile (Card List) --- */}
      <div className="block md:hidden space-y-4">
        {events.map((event) => {
          const status = getEventStatus(event.start_date, event.end_date);
          return (
            <Card key={event.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate pr-2">{event.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={status.variant}>{status.text}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {/* Gunakan fungsi format yang baru */}
                      {formatTableDate(event.start_date, event.end_date)}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <EventActions event={event} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}
