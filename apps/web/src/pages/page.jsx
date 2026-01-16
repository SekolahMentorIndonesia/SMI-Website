import SMIHeader from "../components/SMIHeader";
import SMIHero from "../components/SMIHero";
import SMIAbout from "../components/SMIAbout";
import SMIPrograms from "../components/SMIPrograms";
import SMIAdvantages from "../components/SMIAdvantages";
import SMITestimonials from "../components/SMITestimonials";
import SMICTA from "../components/SMICTA";
import SMIFooter from "../components/SMIFooter";
import SMIFounderStory from "../components/SMIFounderStory";

// Halaman landing utama publik untuk memperkenalkan Sekolah Mentor Indonesia.
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <SMIHeader />

      {/* Hero Section */}
      <SMIHero />

      <SMIFounderStory />

      {/* About Section */}
      <SMIAbout />

      {/* Programs Section */}
      <SMIPrograms />

      {/* Advantages Section */}
      <SMIAdvantages />

      {/* Testimonials Section */}
      <SMITestimonials />

      {/* Final CTA Section */}
      <SMICTA />

      {/* Footer */}
      <SMIFooter />
    </div>
  );
}
