import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export function meta() {
  return [
    { title: "Program Sekolah Mentor Indonesia - Kursus Content Creator Professional" },
    { name: "description", content: "Pilih program belajar yang sesuai dengan kebutuhan Anda. Kelas content creator, mentoring personal, hingga workshop intensif dengan mentor ahli di SMI." },
    { name: "keywords", content: "program SMI, kursus content creator, kelas konten kreator, mentoring content creator, workshop digital marketing" },
    { property: "og:title", content: "Program Sekolah Mentor Indonesia" },
    { property: "og:description", content: "Program lengkap untuk menjadi content creator profesional dengan mentor ahli." },
    { property: "og:image", content: "/logo.jpeg" },
    { property: "og:image:alt", content: "Program Sekolah Mentor Indonesia" },
    { property: "og:url", content: "https://smi.multipriority.com/program" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "id_ID" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Program Sekolah Mentor Indonesia" },
    { name: "twitter:description", content: "Program lengkap untuk menjadi content creator profesional." },
    { name: "twitter:image", content: "/logo.jpeg" },
    { name: "twitter:image:alt", content: "Program Sekolah Mentor Indonesia" },
    { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
    { rel: "canonical", href: "https://smi.multipriority.com/program" },
    { rel: "alternate", hrefLang: "id", href: "https://smi.multipriority.com/program" },
    { rel: "alternate", hrefLang: "en", href: "https://smi.multipriority.com/en/program" },
    { rel: "alternate", hrefLang: "x-default", href: "https://smi.multipriority.com/program" }
  ];
}

export default function ProgramPage() {
  const programs = [
    {
      id: "basic",
      title: "Content Creator Basic",
      description: "Pengenalan lengkap dunia content creation untuk pemula",
      duration: "4 minggu",
      price: "Rp 1.500.000",
      features: [
        "Modul video pembelajaran",
        "Live session 2x seminggu",
        "Tugas praktik dengan feedback",
        "Sertifikat completion"
      ]
    },
    {
      id: "professional",
      title: "Content Creator Professional",
      description: "Program intensif untuk menjadi content creator profesional",
      duration: "8 minggu",
      price: "Rp 3.000.000",
      features: [
        "Semua fitur Basic",
        "Mentoring personal 1-on-1",
        "Portfolio development",
        "Job placement support"
      ]
    },
    {
      id: "masterclass",
      title: "Advanced Masterclass",
      description: "Program khusus untuk content creator yang ingin naik level",
      duration: "12 minggu",
      price: "Rp 5.000.000",
      features: [
        "Semua fitur Professional",
        "Collaboration opportunities",
        "Brand partnership program",
        "Advanced monetization strategies"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Program Pembelajaran SMI
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih program yang sesuai dengan kebutuhan dan level Anda. 
            Dapatkan bimbingan langsung dari mentor ahli di industri kreatif digital.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {programs.map((program) => (
            <div key={program.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {program.title}
              </h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              
              <div className="mb-4">
                <span className="text-sm text-gray-500">Durasi:</span>
                <span className="ml-2 font-medium">{program.duration}</span>
              </div>
              
              <div className="mb-6">
                <span className="text-2xl font-bold text-blue-600">{program.price}</span>
              </div>
              
              <ul className="space-y-2 mb-6">
                {program.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                to="/booking"
                className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Daftar Sekarang
              </Link>
            </div>
          ))}
        </div>
        
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Butuh Konsultasi?
          </h2>
          <p className="text-gray-600 mb-6">
            Tim kami siap membantu Anda memilih program yang tepat
          </p>
          <Link 
            to="/booking"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Jadwalkan Konsultasi Gratis
          </Link>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
