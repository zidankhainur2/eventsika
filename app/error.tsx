'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to monitoring in production
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-400" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Terjadi Kesalahan
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Maaf, terjadi kesalahan yang tidak terduga. Tim kami sedang bekerja untuk
          memperbaikinya. Silakan coba lagi.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="bg-[#1976D2] hover:bg-[#145DA0] text-white rounded-lg"
          >
            Coba Lagi
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="rounded-lg"
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}
