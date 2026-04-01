// src/app/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
    const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Lukas Graf",
    url: "https://madebyluke.dev",
    jobTitle: "Fullstack Web Developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Vienna",
      addressCountry: "Austria",
    },
    sameAs: [
      "https://github.com/madebylukedev",
      "https://twitter.com/aboutselphy"
    ],
  };
  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
