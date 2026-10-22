import type { Metadata, Viewport } from "next";
import { themeBootstrap } from "@/lib/theme";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rivelolabs.com"),
  title: { default: "Rivelo Labs — Discover new apps & websites, get real users", template: "%s | Rivelo Labs" },
  description: "Discover new apps and websites from independent builders. List your product for free, get upvotes and real users, and put your startup on the world map.",
  applicationName: "Rivelo Labs",
  alternates: { canonical: "/" },
  icons: { icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.png", type: "image/png", sizes: "512x512" }], apple: "/apple-icon.png" },
  category: "technology",
  keywords: ["Rivelo Labs", "new apps", "app directory", "website directory", "startup launch", "indie hackers", "product launch", "get users for my app", "list my app", "startup map"],
  publisher: "Rivelo Labs",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: { title: "Rivelo Labs — Discover new apps & websites", description: "New apps and websites from independent builders. List yours and get real users.", url: "https://rivelolabs.com", siteName: "Rivelo Labs", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Rivelo Labs — Discover new apps & websites", description: "New apps and websites from independent builders. List yours and get real users." },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Rivelo Labs",
  url: "https://rivelolabs.com",
  email: "hello@rivelolabs.com",
  logo: "https://rivelolabs.com/icon-512.png",
  description: "A discovery space for new apps, websites and independent builders.",
};
const siteLd = { "@context": "https://schema.org", "@type": "WebSite", name: "Rivelo Labs", url: "https://rivelolabs.com", potentialAction: { "@type": "SearchAction", target: "https://rivelolabs.com/?q={search_term_string}", "query-input": "required name=search_term_string" } };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before first paint so dark-mode visitors never see a light flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }}/>
        <meta name="color-scheme" content="light"/>
        {/* Structured Data Schema for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, siteLd]) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
