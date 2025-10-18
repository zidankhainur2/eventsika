import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div>
      <div className="p-6 sm:p-8">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Pengaturan
        </h1>
        <p className="text-text-secondary mt-1">
          Kelola detail akun, notifikasi, dan keamananmu.
        </p>
      </div>

      <div className="p-6 sm:p-8 border-t space-y-8">
        {/* Bagian Pengaturan Akun */}
        <Card>
          <CardHeader>
            <CardTitle>Akun</CardTitle>
            <CardDescription>
              Informasi email dan pengaturan keamanan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@student.unsika.ac.id"
                disabled
              />
            </div>
            {/* TODO: Implement password change functionality */}
            <Button disabled>Ubah Password</Button>
          </CardContent>
        </Card>

        {/* Bagian Zona Berbahaya */}
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">Zona Berbahaya</CardTitle>
            <CardDescription>
              Tindakan ini tidak dapat diurungkan. Harap berhati-hati.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: Implement account deletion functionality */}
            <Button variant="destructive" disabled>
              Hapus Akun Saya
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
