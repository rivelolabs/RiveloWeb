import type { Metadata, Viewport } from "next";
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
  themeColor: "#f8f7f4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rivelolabs.com"),
  title: {
    default: "rivelolabs — AI & Software Engineering at flash speed | Calquors Private Limited",
    template: "%s | rivelolabs",
  },
  description:
    "rivelolabs by Calquors Private Limited is a premier digital engineering studio crafting high-throughput AI platforms, native iOS/Android apps, and full-stack software. Creators of OmegleVC (100K+ requests), RevFit, Calarm, and Klyq. Direct project dispatch to hello@rivelolabs.com.",
  keywords: [
    "rivelolabs",
    "Rivelo Labs",
    "Calquors Private Limited",
    "AI Software Engineering",
    "Fullstack Studio",
    "OmegleVC",
    "WebRTC Engineering",
    "SwiftUI Developer",
    "iOS Apps",
    "Next.js Development",
    "Mobile App Studio",
    "Custom Software Agency",
    "hello@rivelolabs.com",
  ],
  authors: [{ name: "rivelolabs", url: "https://rivelolabs.com" }],
  creator: "rivelolabs",
  publisher: "Calquors Private Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://rivelolabs.com",
    languages: {
      "en-US": "https://rivelolabs.com",
      "x-default": "https://rivelolabs.com",
    },
  },
  openGraph: {
    title: "rivelolabs — AI & Software Engineering at flash speed",
    description:
      "Sub-second AI architectures, high-performance web & mobile systems. Handling 100K+ requests at flash speed. Inquiries to hello@rivelolabs.com.",
    url: "https://rivelolabs.com",
    siteName: "rivelolabs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/cloud.jpg",
        width: 1200,
        height: 630,
        alt: "rivelolabs — AI & Software Engineering at flash speed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "rivelolabs — AI & Software Engineering at flash speed",
    description:
      "Sub-second AI architectures, high-performance web & mobile systems. Dispatched directly to hello@rivelolabs.com.",
    images: ["/cloud.jpg"],
    creator: "@rivelolabs",
  },
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://rivelolabs.com/#organization",
      "name": "rivelolabs",
      "legalName": "Calquors Private Limited",
      "alternateName": ["Rivelo Labs", "Calquors Private Limited"],
      "url": "https://rivelolabs.com",
      "email": "hello@rivelolabs.com",
      "logo": "https://rivelolabs.com/logo.png",
      "description": "Next-generation software and AI engineering studio by Calquors Private Limited crafting premium mobile and web platforms.",
      "sameAs": ["https://twitter.com/rivelolabs", "https://github.com/rivelolabs"],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@rivelolabs.com",
        "contactType": "customer service",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://rivelolabs.com/#website",
      "url": "https://rivelolabs.com",
      "name": "rivelolabs",
      "publisher": { "@id": "https://rivelolabs.com/#organization" },
      "inLanguage": "en-US",
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://rivelolabs.com/#service",
      "name": "rivelolabs AI & Software Engineering",
      "image": "https://rivelolabs.com/cloud.jpg",
      "url": "https://rivelolabs.com",
      "email": "hello@rivelolabs.com",
      "priceRange": "$$$$",
      "serviceType": [
        "AI Architecture & Engineering",
        "Web Application Development",
        "Mobile iOS & Android Development",
        "Real-time WebRTC & WebSocket Systems",
      ],
      "areaServed": "Global",
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://rivelolabs.com/#omeglevc",
      "name": "OmegleVC",
      "applicationCategory": "CommunicationApplication",
      "operatingSystem": "Web",
      "url": "https://omeglevc.com",
      "description": "Real-time random video and voice connection platform with WebRTC mesh and sub-50ms peer matching handling 100K+ requests.",
      "author": { "@id": "https://rivelolabs.com/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://rivelolabs.com/#revfit",
      "name": "RevFit",
      "applicationCategory": "HealthApplication",
      "operatingSystem": "iOS",
      "description": "All-in-one lifestyle & performance companion with SwiftUI, HealthKit, charts, and personalized coaching.",
      "author": { "@id": "https://rivelolabs.com/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://rivelolabs.com/#calarm",
      "name": "Calarm",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "iOS",
      "description": "Smart wake-up app syncing Google Calendar events with reliable push-backed alarms.",
      "author": { "@id": "https://rivelolabs.com/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://rivelolabs.com/#klyq",
      "name": "Klyq",
      "applicationCategory": "SocialNetworkingApplication",
      "operatingSystem": "iOS, Android",
      "description": "Live matchmaking arena with random video, multiplayer mini-games, and anonymous circles.",
      "author": { "@id": "https://rivelolabs.com/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://rivelolabs.com/#breadcrumbs",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://rivelolabs.com",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Featured Work",
          "item": "https://rivelolabs.com/#work",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Engineering Services",
          "item": "https://rivelolabs.com/#services",
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": "Contact & Dispatch",
          "item": "https://rivelolabs.com/#contact",
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://rivelolabs.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How fast can rivelolabs build and deploy a production-grade AI or web platform?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Rapid MVPs and AI tools are typically designed, built, and deployed within 1 to 2 weeks. Full production-grade SaaS platforms, native iOS/Android mobile applications, and WebRTC systems typically ship in 3 to 5 weeks.",
          },
        },
        {
          "@type": "Question",
          "name": "What high-traffic platforms and scalable applications has rivelolabs engineered?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We have engineered and scaled applications like OmegleVC (omeglevc.com) handling over 100K+ network requests and 20K+ active visitors with sub-50ms WebRTC latency. We also built RevFit, Calarm, and Klyq.",
          },
        },
        {
          "@type": "Question",
          "name": "Who owns the code, intellectual property (IP), and architecture?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You own 100% of all intellectual property, source code, design files, and cloud infrastructure upon project handover. Calquors Private Limited / rivelolabs signs comprehensive NDAs by default and ensures zero vendor lock-in.",
          },
        },
        {
          "@type": "Question",
          "name": "How do I submit my project brief and what happens after?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can submit your project directly through our interactive dispatcher or email hello@rivelolabs.com. A senior engineering lead reviews your requirements, prepares an architectural breakdown and scope estimate, and reaches out within 24 hours.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        {/* Preload critical LCP Hero background asset */}
        <link rel="preload" as="image" href="/cloud.jpg" fetchPriority="high" />
        {/* Structured Data Schema for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans bg-[#f8f7f4] text-[#18181b] antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
