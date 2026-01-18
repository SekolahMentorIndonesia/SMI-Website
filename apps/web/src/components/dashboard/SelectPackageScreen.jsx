import { Package, ArrowRight } from "lucide-react";

export default function SelectPackageScreen() {
  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package className="w-10 h-10 text-brand-600" />
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-4">Pilih Paket Mentoring</h1>
      <p className="text-neutral-600 mb-8 leading-relaxed">
        Anda belum memilih paket mentoring. Silakan pilih paket untuk melanjutkan ke proses pembayaran dan akses dashboard.
      </p>
      <button 
        onClick={() => window.location.href = '/#paket'}
        className="px-8 py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all flex items-center justify-center gap-2 mx-auto shadow-lg shadow-brand-600/20"
      >
        Pilih Paket Sekarang
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
