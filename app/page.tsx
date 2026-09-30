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

import { getCatalog } from "@/lib/store";

// stránka se obnoví hned po uložení v administraci (revalidatePath)
export const revalidate = 300;

export default async function Home() {
  const catalog = await getCatalog();
  return (
    <>
      <Header />
      <main>
        <Hero catalog={catalog} />
        <Marquee />
        <Variants data={catalog.boxes} edition={catalog.edition} />
        <Numbers />
        <Seasons current={catalog.edition} />
        <HowItWorks />
        <ForCompanies />
        <Faq />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
