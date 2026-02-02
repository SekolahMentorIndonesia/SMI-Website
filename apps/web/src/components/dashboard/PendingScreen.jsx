import { Clock, MessageSquare } from "lucide-react";

export default function PendingScreen() {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-4">Menunggu Verifikasi</h1>
      <p className="text-neutral-600 mb-8 leading-relaxed">
        Terima kasih telah mengunggah bukti! Pembayaran Anda sedang diverifikasi oleh Admin SMI. 
        Proses ini biasanya memakan waktu maksimal 24 jam.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold uppercase tracking-wider">
          <span className="w-2 h-2 bg-amber-600 rounded-full animate-ping" />
          Status: Sedang Diverifikasi
        </div>
        
        <a 
          href="https://wa.me/6287744556696" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-2 bg-white border border-neutral-200 text-neutral-900 rounded-full text-sm font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Hubungi Admin
        </a>
      </div>
    </div>
  );
}
