import { Link } from "react-router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OptimizedImage from "../../components/OptimizedImage";

export function meta() {
  return [
    { title: "Kelas Content Creator - Sekolah Mentor Indonesia" },
    { name: "description", content: "Pilih kelas content creator yang sesuai dengan kebutuhan Anda. Basic, Professional, hingga Masterclass dengan mentor ahli di SMI." },
    { name: "keywords", content: "kelas content creator, kursus konten kreator, belajar content creation, mentoring online, kelas digital marketing" },
    { property: "og:title", content: "Kelas Content Creator - Sekolah Mentor Indonesia" },
    { property: "og:description", content: "Kelas lengkap untuk menjadi content creator profesional dengan mentor ahli." },
    { property: "og:image", content: "/logo.jpeg" },
    { property: "og:image:alt", content: "Kelas Content Creator SMI" },
    { property: "og:image:width", content: "400" },
    { property: "og:image:height", content: "400" },
    { property: "og:url", content: "https://smi.multipriority.com/kelas" },
    { property: "og:type", content: "website" },
    { property: "og:locale", content: "id_ID" },
    { property: "og:site_name", content: "Sekolah Mentor Indonesia" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@sekolahmentor_id" },
    { name: "twitter:creator", content: "@sekolahmentor_id" },
    { name: "twitter:title", content: "Kelas Content Creator - SMI" },
    { name: "twitter:description", content: "Kelas lengkap untuk menjadi content creator profesional." },
    { name: "twitter:image", content: "/logo.jpeg" },
    { name: "twitter:image:alt", content: "Kelas Content Creator SMI" },
    { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
    { rel: "canonical", href: "https://smi.multipriority.com/kelas" },
    { rel: "alternate", hrefLang: "id", href: "https://smi.multipriority.com/kelas" },
    { rel: "alternate", hrefLang: "en", href: "https://smi.multipriority.com/en/kelas" },
    { rel: "alternate", hrefLang: "x-default", href: "https://smi.multipriority.com/kelas" }
  ];
}

export default function KelasPage() {
  const kelasList = [
    {
      id: "basic",
      title: "Content Creator Basic",
      level: "Pemula",
      duration: "4 minggu",
      price: "Rp 1.500.000",
      image: "/logo.jpeg",
      description: "Pengenalan lengkap dunia content creation untuk pemula",
      topics: ["Fundamental Content Creation", "Basic Photography", "Video Editing 101", "Social Media Strategy"],
      mentor: "Tim Mentor SMI"
    },
    {
      id: "professional",
      title: "Content Creator Professional",
      level: "Menengah",
      duration: "8 minggu",
      price: "Rp 3.000.000",
      image: "/logo.jpeg",
      description: "Program intensif untuk menjadi content creator profesional",
      topics: ["Advanced Content Strategy", "Personal Branding", "Monetization", "Analytics & Growth"],
      mentor: "Senior Mentor SMI"
    },
    {
      id: "masterclass",
      title: "Content Creator Masterclass",
      level: "Lanjutan",
      duration: "12 minggu",
      price: "Rp 5.000.000",
      image: "/logo.jpeg",
      description: "Program khusus untuk content creator yang ingin naik level",
      topics: ["Business Creation", "Team Management", "Investment & Finance", "Industry Leadership"],
      mentor: "Expert Mentor SMI"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Header Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Kelas Content Creator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Pilih kelas yang sesuai dengan level dan tujuan karir Anda. 
            Dapatkan bimbingan langsung dari mentor ahli di industri kreatif digital.
          </p>
          
          {/* Level Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['Semua', 'Pemula', 'Menengah', 'Lanjutan'].map((level) => (
              <button
                key={level}
                className="px-6 py-2 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors font-medium"
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        {/* Kelas Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {kelasList.map((kelas) => (
            <article key={kelas.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Class Image */}
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 relative">
                <OptimizedImage
                  src={kelas.image}
                  alt={`${kelas.title} - ${kelas.level}`}
                  className="w-full h-full object-cover"
                  width="400"
                  height="225"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600">
                  {kelas.level}
                </div>
              </div>

              {/* Class Content */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {kelas.title}
                </h2>
                <p className="text-gray-600 mb-4">{kelas.description}</p>

                {/* Class Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {kelas.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {kelas.mentor}
                  </div>
                </div>

                {/* Topics */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Topik Pembelajaran:</h3>
                  <ul className="space-y-1">
                    {kelas.topics.map((topic, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-3 h-3 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price & CTA */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-600">{kelas.price}</span>
                    <span className="text-sm text-gray-500">per kelas</span>
                  </div>
                  <Link 
                    to="/booking"
                    className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Perjalanan Content Creator?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Bergabunglah dengan ribuan content creator yang telah sukses bersama SMI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/booking"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Konsultasi Gratis
            </Link>
            <Link 
              to="/program"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-medium"
            >
              Lihat Program Lengkap
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
