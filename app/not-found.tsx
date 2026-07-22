import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <SearchX className="h-12 w-12 text-gray-400" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia. Mungkin URL salah atau halaman
          sudah dihapus.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-[#1976D2] hover:bg-[#145DA0] text-white rounded-lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </Button>
          <Button variant="outline" asChild className="rounded-lg">
            <Link href="/explore">Jelajahi Event</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
