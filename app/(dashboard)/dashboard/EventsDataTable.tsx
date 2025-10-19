"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FiMoreHorizontal, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";

import { type Event } from "@/lib/types";
import { useOrganizerEvents } from "@/lib/hooks/useEvents";
import { deleteEvent } from "@/app/action";
import { cn } from "@/lib/utils";

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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
              Tindakan ini tidak dapat diurungkan. Event "{event.title}" akan
              dihapus secara permanen dari server.
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

function getEventStatus(eventDate: string): {
  text: string;
  variant: "default" | "secondary" | "destructive";
} {
  const now = new Date();
  const date = new Date(eventDate);
  if (date < now) {
    return { text: "Selesai", variant: "secondary" };
  }
  return { text: "Mendatang", variant: "default" };
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
            const status = getEventStatus(event.event_date);
            return (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  {new Date(event.event_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
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
  );
}
