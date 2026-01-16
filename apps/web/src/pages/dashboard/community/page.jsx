import UserLayout from "../../../layouts/UserLayout";
import UserGuard from "../../../components/dashboard/UserGuard";
import { MessageSquare, Users, ExternalLink } from "lucide-react";

export default function CommunityPage() {
  return (
    <UserGuard requireApproved={true}>
      <UserLayout>
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Komunitas SMI</h1>
            <p className="text-neutral-500 font-medium">Terhubung dengan mentor-mentor hebat lainnya.</p>
          </div>

          <div className="bg-neutral-900 rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center mb-8 rotate-3 shadow-xl shadow-brand-600/20">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Gabung Discord Eksklusif</h2>
              <p className="text-neutral-400 mb-8 text-lg">
                Dapatkan akses ke channel diskusi, sharing session, dan networking langsung dengan para alumni SMI.
              </p>
              <button className="flex items-center gap-3 px-10 py-5 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all hover:scale-105 shadow-xl shadow-brand-600/20">
                Masuk ke Server Discord
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-brand-600/10 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-600/10 blur-[100px] translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 flex items-start gap-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Member Directory</h3>
                <p className="text-neutral-500 mb-4 text-sm leading-relaxed">Lihat profil mentor lainnya dan mulai kolaborasi baru hari ini.</p>
                <button className="text-brand-600 font-bold text-sm hover:underline">Lihat Semua Mentor →</button>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 flex items-start gap-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                <MessageSquare className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">Forum Diskusi</h3>
                <p className="text-neutral-500 mb-4 text-sm leading-relaxed">Tanyakan apa saja seputar dunia mentoring dan dapatkan jawabannya.</p>
                <button className="text-brand-600 font-bold text-sm hover:underline">Buka Forum →</button>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    </UserGuard>
  );
}
