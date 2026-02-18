export default function StructuredData({ type, data }) {
  const getSchema = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Sekolah Mentor Indonesia",
          "alternateName": "SMI",
          "url": "https://smi.multipriority.com/",
          "logo": "https://smi.multipriority.com/logo.jpeg",
          "description": "Platform edukasi terdepan untuk content creator. Pelajari strategi branding, produksi konten, dan monetisasi.",
          "sameAs": [
            "https://www.instagram.com/sekolahmentor_id"
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Blk. G, Sriamur",
            "addressLocality": "Kec. Tambun Utara",
            "addressRegion": "Jawa Barat",
            "postalCode": "17510",
            "addressCountry": "ID"
          },
          "parentOrganization": {
            "@type": "Corporation",
            "name": "PT Multiusaha Prioritas Bersama",
            "url": "https://multipriority.com"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+62-812-3456-7890",
            "contactType": "customer service",
            "availableLanguage": ["Indonesian", "English"]
          }
        };

      case 'course':
        return {
          "@context": "https://schema.org",
          "@type": "Course",
          "name": data.title,
          "description": data.description,
          "provider": {
            "@type": "Organization",
            "name": "Sekolah Mentor Indonesia",
            "url": "https://smi.multipriority.com/"
          },
          "educationalLevel": data.level,
          "timeRequired": data.duration,
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "IDR",
            "availability": "https://schema.org/InStock"
          },
          "coursePrerequisites": data.prerequisites || "Tidak ada",
          "syllabusSections": data.topics?.map(topic => ({
            "@type": "Syllabus",
            "name": topic,
            "description": `Pembelajaran tentang ${topic}`
          })) || []
        };

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        };

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Sekolah Mentor Indonesia",
          "url": "https://smi.multipriority.com/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://smi.multipriority.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        };

      default:
        return null;
    }
  };

  const schema = getSchema();
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
}
