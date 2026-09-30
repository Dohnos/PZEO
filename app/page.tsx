import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Variants } from "@/components/Variants";
import { Marquee } from "@/components/Marquee";
import { Numbers } from "@/components/Numbers";
import { Seasons } from "@/components/Seasons";
import { HowItWorks } from "@/components/HowItWorks";
import { ForCompanies } from "@/components/ForCompanies";
import { Faq } from "@/components/Faq";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Variants />
        <Numbers />
        <Seasons />
        <HowItWorks />
        <ForCompanies />
        <Faq />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
