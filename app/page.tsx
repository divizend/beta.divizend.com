import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { EmailForm } from "@/components/email-form";

function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Divizend Beta",
    description:
      "Join the Divizend beta program and help shape the future of financial technology.",
    url: "https://beta.divizend.com",
    publisher: {
      "@type": "Organization",
      name: "Divizend",
      url: "https://divizend.com",
      logo: {
        "@type": "ImageObject",
        url: "https://beta.divizend.com/divizend-tworows-white.svg",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <StructuredData />
      <div className="h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <ThemeToggle />
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center w-full max-w-5xl flex-1 py-4">
          {/* Logo - Above Heading */}
          <div className="mb-3 sm:mb-4 md:mb-5">
            <Link
              href="https://divizend.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-opacity hover:opacity-60 active:opacity-40"
              aria-label="Divizend Startseite"
            >
              <Image
                src="/divizend-tworows-white.svg"
                alt="Divizend"
                width={120}
                height={32}
                className="h-6 sm:h-7 md:h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extralight tracking-[-0.02em] text-center w-full leading-[0.95] select-none mb-6 sm:mb-8 md:mb-10">
            <span className="block">Shape the</span>
            <span className="block mt-0.5 sm:mt-1">Future of</span>
            <span className="block mt-0.5 sm:mt-1">FinTech</span>
          </h1>

          {/* Email Form */}
          <EmailForm />
        </div>

        {/* Footer Links */}
        <footer className="absolute bottom-3 left-0 right-0 flex justify-center gap-4 sm:gap-5 text-[9px] sm:text-[10px] md:text-xs text-muted-foreground/70 pb-1 sm:pb-2">
          <Link
            href="https://divizend.com/imprint"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground/90 active:text-foreground"
          >
            Impressum
          </Link>
          <span className="text-muted-foreground/40">•</span>
          <Link
            href="https://divizend.com/data-protection"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground/90 active:text-foreground"
          >
            Datenschutz
          </Link>
        </footer>
      </div>
    </>
  );
}
