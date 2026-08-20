import React from 'react';
import { MessageSquare, FileCheck, Layers, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function ValuePropsSection() {
  const values = [
    {
      icon: MessageSquare,
      title: 'Komunikasi Langsung via WhatsApp',
      description: 'Konsultasi langsung dengan admin tanpa perantara platform rumit. Anda dapat memantau progres dan memberikan catatan tambahan kapan saja.'
    },
    {
      icon: FileCheck,
      title: 'Kesesuaian Format & Pedoman',
      description: 'Pengerjaan disesuaikan dengan instruksi dosen, silabus mata kuliah, rubrik penilaian, atau buku pedoman resmi instansi Anda.'
    },
    {
      icon: Layers,
      title: 'Pilihan Layanan Beragam',
      description: 'Mendukung berbagai jenis tugas akademik: esai, makalah ilmiah, olah data statistik, laporan PKL, slide presentasi, hingga bab skripsi.'
    },
    {
      icon: RefreshCw,
      title: 'Garansi Revisi Sesuai Ketentuan',
      description: 'Tersedia penyesuaian pengerjaan jika terdapat poin instruksi awal yang belum terpenuhi, sehingga hasil akhir tetap optimal.'
    }
  ];

  return (
    <section className="py-16 bg-surface-mist border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight">
            Prinsip Layanan <span className="text-brand-500">JokiTugasKu</span>
          </h2>
          <p className="mt-3 text-base text-ink-secondary">
            Kami mengutamakan transparansi, kerapian pengerjaan, dan kemudahan komunikasi dari awal hingga selesai.
          </p>
        </div>

        {/* 4 Value Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card key={index} hoverable className="flex flex-col h-full bg-white">
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-ink-primary mb-2.5">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-secondary leading-relaxed flex-grow">
                  {item.description}
                </p>
              </Card>
            );
          })}
        </div>

      </div>
    </section>
  );
}
