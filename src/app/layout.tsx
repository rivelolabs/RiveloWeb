import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rivelolabs — We Build What's Next",
  description:
    "Rivelolabs is a next-generation tech studio crafting premium mobile and web experiences. Creators of RevFit.",
  keywords: ["Rivelolabs", "RevFit", "iOS", "SwiftUI", "mobile apps", "tech studio"],
  openGraph: {
    title: "Rivelolabs — We Build What's Next",
    description: "Next-generation tech studio crafting premium digital experiences.",
    url: "https://rivelolabs.com",
    siteName: "Rivelolabs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans grain`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
