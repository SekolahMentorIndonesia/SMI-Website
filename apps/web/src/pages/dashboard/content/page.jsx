import UserLayout from "../../../layouts/UserLayout";
import UserGuard from "../../../components/dashboard/UserGuard";
import { BookOpen, Play, Lock } from "lucide-react";

export default function ContentPage() {
  const materials = [
    { id: 1, title: "Mindset Dasar Mentor Profesional", duration: "15:20", type: "video" },
    { id: 2, title: "Cara Membangun Personal Branding", duration: "25:45", type: "video" },
    { id: 3, title: "Teknik Komunikasi Efektif", duration: "18:10", type: "video" },
  ];

  return (
    <UserGuard requireApproved={true}>
      <UserLayout>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Konten Saya</h1>
            <p className="text-neutral-500 font-medium">Akses semua materi eksklusif SMI di sini.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((item) => (
              <div key={item.id} className="bg-white rounded-3xl border border-neutral-100 overflow-hidden group hover:shadow-xl hover:shadow-neutral-500/5 transition-all">
                <div className="aspect-video bg-neutral-900 flex items-center justify-center relative overflow-hidden">
                  <Play className="w-12 h-12 text-white/50 group-hover:text-white group-hover:scale-110 transition-all z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold uppercase rounded-full">Video</span>
                    <span className="text-neutral-400 text-xs font-medium">{item.duration}</span>
                  </div>
                  <h3 className="font-bold text-neutral-900 group-hover:text-brand-600 transition-colors">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </UserLayout>
    </UserGuard>
  );
}
