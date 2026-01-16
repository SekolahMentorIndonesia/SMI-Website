import { XCircle, MessageSquare, Upload } from "lucide-react";

export default function RejectedScreen({ onRetry }) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle className="w-10 h-10 text-red-600" />
      </div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-4">Pembayaran Ditolak</h1>
      <p className="text-neutral-600 mb-8 leading-relaxed">
        Mohon maaf, bukti pembayaran yang Anda unggah tidak valid atau tidak sesuai. 
        Silakan periksa kembali atau hubungi admin kami untuk informasi lebih lanjut.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          onClick={onRetry}
          className="w-full sm:w-auto px-8 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
        >
          <Upload className="w-5 h-5" />
          Upload Ulang Bukti
        </button>
        <a 
          href="https://wa.me/6287744556696" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-8 py-4 bg-white border border-neutral-200 text-neutral-900 rounded-2xl font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          Hubungi Admin
        </a>
      </div>
    </div>
  );
}
