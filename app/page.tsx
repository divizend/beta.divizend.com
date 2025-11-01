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
      "Join the Divizend beta program and personalize your investment experience.",
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
      <div className="h-screen min-h-screen max-h-screen flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 relative overflow-hidden w-full max-w-full">
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
          <ThemeToggle />
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col items-center justify-center w-full max-w-full px-1 sm:max-w-5xl flex-1 py-2 sm:py-3 md:py-4 min-h-0">
          {/* Logo - Above Heading */}
          <div className="mb-2 sm:mb-3 md:mb-4 lg:mb-5 flex-shrink-0">
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
                className="h-7 sm:h-8 md:h-9 lg:h-10 xl:h-12 w-auto max-w-full"
                priority
              />
            </Link>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-extralight tracking-[-0.02em] text-center w-full max-w-full px-1 leading-[0.92] select-none mb-4 sm:mb-5 md:mb-6 lg:mb-8 flex-shrink-0">
            <span className="block break-words">Personalize your</span>
            <span className="block mt-0.5 break-words">investment</span>
            <span className="block mt-0.5 break-words">experience.</span>
          </h1>

          {/* Email Form */}
          <div className="w-full max-w-full flex-shrink-0 flex justify-center">
            <EmailForm />
          </div>
        </div>

        {/* Footer Links */}
        <footer className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 sm:gap-4 md:gap-5 text-[10px] sm:text-[10px] md:text-[11px] lg:text-xs text-muted-foreground/70 pb-1 px-2 flex-shrink-0">
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
