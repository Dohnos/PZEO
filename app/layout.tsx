import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/figtree";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pauzeo | Wellbeing boxy pro firmy",
  description:
    "Čtvrtletní boxy se šesti věcmi od českých manufaktur pro klid, péči a pohyb vašeho týmu. Tři varianty, pánská i dámská náplň.",
};

export const viewport: Viewport = {
  themeColor: "#edf2f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
