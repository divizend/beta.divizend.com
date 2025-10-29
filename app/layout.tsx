import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://beta.divizend.com"),
  title: {
    default: "Divizend Beta | Shape the Future of FinTech",
    template: "%s | Divizend",
  },
  description:
    "Join the Divizend beta program and help shape the future of financial technology. Be among the first to experience innovative FinTech solutions.",
  keywords: [
    "Divizend",
    "FinTech",
    "financial technology",
    "beta program",
    "financial innovation",
    "fintech startup",
  ],
  authors: [{ name: "Divizend" }],
  creator: "Divizend",
  publisher: "Divizend",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://beta.divizend.com",
    siteName: "Divizend Beta",
    title: "Divizend Beta | Shape the Future of FinTech",
    description:
      "Join the Divizend beta program and help shape the future of financial technology.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Divizend Beta",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Divizend Beta | Shape the Future of FinTech",
    description:
      "Join the Divizend beta program and help shape the future of financial technology.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://beta.divizend.com",
  },
  verification: {
    // Add your verification codes here if needed
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
