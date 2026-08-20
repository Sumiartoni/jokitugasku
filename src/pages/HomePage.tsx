import React, { useEffect } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ValuePropsSection } from '@/components/home/ValuePropsSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { WhyUsSection } from '@/components/home/WhyUsSection';
import { PortfolioSection } from '@/components/home/PortfolioSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaBannerSection } from '@/components/home/CtaBannerSection';
import { faqsData } from '@/data/faqs';
import { servicesData } from '@/data/services';

export function HomePage() {
  useEffect(() => {
    document.title = 'Joki Tugas Kuliah & Laporan PKL Terpercaya - JokiTugasKu';
    
    // Dynamic Meta Description Injection
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Jasa joki tugas kuliah, joki laporan PKL & magang, makalah, proposal, dan skripsi terpercaya. Pengerjaan cepat, rapi, anti-plagiarisme, dan bergaransi revisi.'
      );
    }
  }, []);

  // ProfessionalService & LocalBusiness JSON-LD Schema
  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "JokiTugasKu",
    "image": "https://jokitugasku.id/logo.png",
    "@id": "https://jokitugasku.id/#service",
    "url": "https://jokitugasku.id",
    "telephone": "+6281234567890",
    "priceRange": "Rp 30.000 - Rp 500.000",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ID",
      "addressLocality": "Indonesia"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -6.2088,
      "longitude": 106.8456
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "22:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1250",
      "bestRating": "5"
    }
  };

  // FAQPage JSON-LD Schema for Google Rich Snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqsData.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  // Service Catalog Schema
  const serviceCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": "Katalog Layanan JokiTugasKu",
    "itemListElement": servicesData.map((s, idx) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": s.title,
        "description": s.shortDesc,
        "url": `https://jokitugasku.id/layanan/${s.slug}`
      },
      "position": idx + 1
    }))
  };

  return (
    <main>
      {/* Structured SEO Schemas */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceCatalogSchema) }} />

      <HeroSection />
      <ValuePropsSection />
      <ServicesSection />
      <HowItWorksSection />
      <WhyUsSection />
      <PortfolioSection />
      <FaqSection />
      <CtaBannerSection />
    </main>
  );
}
