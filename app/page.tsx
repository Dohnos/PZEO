import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Variants } from "@/components/Variants";
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
        <Variants />
        <HowItWorks />
        <ForCompanies />
        <Faq />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
