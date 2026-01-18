import NavbarLanding from "../components/NavbarLanding";
import SMIHero from "../components/SMIHero";
import SMIProducts from "../components/SMIProducts";
import SMIFeatures from "../components/SMIFeatures";
import SMIBenefits from "../components/SMIBenefits";
import SMIAbout from "../components/SMIAbout";
import SMIBlog from "../components/SMIBlog";
import SMIFAQ from "../components/SMIFAQ";
import SMIContact from "../components/SMIContact";
import SMITestimonials from "../components/SMITestimonials";
import SMICTA from "../components/SMICTA";
import SMIFooter from "../components/SMIFooter";
import SMIFounderStory from "../components/SMIFounderStory";

// Halaman landing utama publik untuk memperkenalkan Sekolah Mentor Indonesia.
export function meta() {
  return [
    { title: "Sekolah Mentor Indonesia - Platform Mentoring untuk Content Creator Indonesia" },
    { 
      name: "description", 
      content: "Platform mentoring terbaik untuk content creator Indonesia. Belajar dari mentor profesional, bergabung dengan komunitas kreator, dan kembangkan karir digital Anda dengan program komprehensif." 
    },
    { 
      name: "keywords", 
      content: "sekolah mentor indonesia, mentoring content creator, kursus digital, belajar content creation, komunitas creator, platform mentoring indonesia, kursus online indonesia, mentor profesional, belajar digital marketing" 
    },
    { property: "og:title", content: "Sekolah Mentor Indonesia - Platform Mentoring untuk Content Creator" },
    { 
      property: "og:description", 
      content: "Platform mentoring terbaik untuk content creator Indonesia. Belajar dari mentor profesional dan bergabung dengan komunitas kreator." 
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://smi.id" },
    { property: "og:image", content: "https://smi.id/logo.jpeg" },
    { property: "og:image:alt", content: "Logo Sekolah Mentor Indonesia - Platform Mentoring Content Creator" },
    { property: "og:site_name", content: "Sekolah Mentor Indonesia" },
    { property: "og:locale", content: "id_ID" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Sekolah Mentor Indonesia - Platform Mentoring untuk Content Creator" },
    { name: "twitter:description", content: "Platform mentoring untuk content creator Indonesia" },
    { name: "twitter:image", content: "https://smi.id/logo.jpeg" },
    { name: "twitter:image:alt", content: "Logo Sekolah Mentor Indonesia - Platform Mentoring Content Creator" },
    { name: "twitter:site", content: "@sekolahmentorid" },
    { name: "robots", content: "index, follow" },
    { name: "author", content: "Mohammad Iqbal Alhafizh" },
    { name: "theme-color", content: "#2563eb" },
    { name: "application-name", content: "Sekolah Mentor Indonesia" },
    { name: "apple-mobile-web-app-title", content: "SMI" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { rel: "canonical", href: "https://smi.id" }
  ];
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <NavbarLanding />

      {/* Hero Section */}
      <SMIHero />

      {/* About Section */}
      <SMIAbout />

      {/* Products Section */}
      <SMIProducts />

      {/* Features Section */}
      <SMIFeatures />

      {/* Benefits Section */}
      <SMIBenefits />

      {/* Testimonials Section */}
      <SMITestimonials />

      {/* Blog Section */}
      <SMIBlog />

      {/* FAQ Section */}
      <SMIFAQ />

      {/* Contact Section */}
      <SMIContact />

      {/* Footer */}
      <SMIFooter />
    </div>
  );
}
