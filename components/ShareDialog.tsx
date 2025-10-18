"use client";

import { FiShare2, FiCopy } from "react-icons/fi";
import { FaWhatsapp, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ShareDialogProps {
  eventTitle: string;
  eventUrl: string;
}

export default function ShareDialog({
  eventTitle,
  eventUrl,
}: ShareDialogProps) {
  const text = `Jangan lewatkan event seru: "${eventTitle}"! Cek detailnya di sini:`;

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${text} ${eventUrl}`
      )}`,
      color: "hover:text-green-500",
    },
    {
      name: "X",
      icon: <FaXTwitter />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(eventUrl)}`,
      color: "hover:text-black dark:hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        eventUrl
      )}`,
      color: "hover:text-blue-600",
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      toast.success("Tautan berhasil disalin!");
    } catch (error) {
      toast.error("Gagal menyalin tautan");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FiShare2 className="h-4 w-4" />
          Bagikan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bagikan Event Ini</DialogTitle>
          <DialogDescription>
            Salin tautan untuk dibagikan ke Instagram, atau pilih platform lain
            di bawah.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={eventUrl} readOnly />
          </div>
          <Button
            type="button"
            size="sm"
            className="px-3"
            onClick={handleCopy}
            aria-label="Salin tautan"
          >
            <span className="sr-only">Salin</span>
            <FiCopy className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-around pt-4 gap-2">
          {shareOptions.map((opt) => (
            <a
              key={opt.name}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-2 text-muted-foreground transition-colors ${opt.color}`}
              aria-label={`Bagikan ke ${opt.name}`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-xs">{opt.name}</span>
            </a>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
