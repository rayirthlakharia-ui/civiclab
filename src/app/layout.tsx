import type { Metadata } from "next";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/shared";
import "./globals.css";
import "@fontsource-variable/dm-sans";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "./design.css";

export const metadata: Metadata = {
  title: {
    default: "CivicLab — Your world. Your voice.",
    template: "%s | CivicLab",
  },
  description:
    "Explore your rights, understand local government, and make sense of real legislation. An educational prototype for curious citizens.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
