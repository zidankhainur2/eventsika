import { FiMenu } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DashboardNavContent } from "@/components/dashboard/DashboardNavContent";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[256px_1fr]">
      {/* --- Sidebar untuk Desktop --- */}
      <div className="hidden border-r bg-background md:block">
        <DashboardNavContent />
      </div>

      <div className="flex flex-col">
        {/* --- Header untuk Mobile --- */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden sticky top-0 z-40">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <FiMenu className="h-5 w-5" />
                <span className="sr-only">Buka menu navigasi</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <VisuallyHidden.Root>
                <SheetTitle>Menu Navigasi</SheetTitle>
              </VisuallyHidden.Root>
              <DashboardNavContent />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold font-heading">Menu</h1>
          </div>
        </header>

        {/* --- Konten Utama --- */}
        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 lg:p-8 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
