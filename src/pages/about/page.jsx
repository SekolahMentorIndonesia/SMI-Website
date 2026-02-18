import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OptimizedImage from "../../components/OptimizedImage";

export function meta() {
  return [
    { title: "Tentang Sekolah Mentor Indonesia - Platform Edukasi Content Creator" },
    { name: "description", content: "Kenali Sekolah Mentor Indonesia (SMI), platform edukasi terdepan untuk calon content creator profesional. Belajar dari mentor ahli dengan kurikulum terstruktur." },
    { name: "keywords", content: "tentang sekolah mentor indonesia, tentang SMI, platform edukasi content creator, mentoring online, kursus konten kreator" },
    { property: "og:title", content: "Tentang Sekolah Mentor Indonesia" },
    { property: "og:description", content: "Platform edukasi terdepan untuk content creator profesional di Indonesia." },
    { property: "og:image", content: "/logo.jpeg" },
    { property: "og:image:alt", content: "Logo Sekolah Mentor Indonesia" },
    { property: "og:url", content: "https://smi.multipriority.com/about" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "id_ID" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Tentang Sekolah Mentor Indonesia" },
    { name: "twitter:description", content: "Platform edukasi terdepan untuk content creator profesional." },
    { name: "twitter:image", content: "/logo.jpeg" },
    { name: "twitter:image:alt", content: "Logo Sekolah Mentor Indonesia" },
    { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
    { rel: "canonical", href: "https://smi.multipriority.com/about" },
    { rel: "alternate", hrefLang: "id", href: "https://smi.multipriority.com/about" },
    { rel: "alternate", hrefLang: "en", href: "https://smi.multipriority.com/en/about" },
    { rel: "alternate", hrefLang: "x-default", href: "https://smi.multipriority.com/about" }
  ];
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Tentang Sekolah Mentor Indonesia
        </h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Visi & Misi Kami
            </h2>
            <p className="text-gray-600 mb-4">
              Sekolah Mentor Indonesia (SMI) didirikan dengan visi menjadi platform edukasi 
              terdepan untuk calon content creator profesional di Indonesia. Kami percaya bahwa 
              setiap orang memiliki potensi untuk menjadi content creator sukses dengan bimbingan 
              mentor yang tepat.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Mengapa Memilih SMI?
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Mentor berpengalaman di industri kreatif digital</li>
              <li>Kurikulum terstruktur dan praktis</li>
              <li>Komunitas yang supportif dan kolaboratif</li>
              <li>Akses ke materi pembelajaran seumur hidup</li>
              <li>Kesempatan kolaborasi dengan brand ternama</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Tim Kami
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <OptimizedImage 
                  src="/mohamad-iqbal-alhafizh-founder-smi.jpeg" 
                  alt="Mohamad Iqbal Alhafizh - Founder SMI"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  width="128"
                  height="128"
                />
                <h3 className="font-semibold text-gray-800">Mohamad Iqbal Alhafizh</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
            </div>
          </section>
          
          <section className="bg-blue-50 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Siap Memulai Perjalanan Anda?
            </h2>
            <p className="text-gray-600 mb-6">
              Bergabunglah dengan ribuan content creator yang telah sukses bersama SMI.
            </p>
            <Link 
              to="/program"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Program Kami
            </Link>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
