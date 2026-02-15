import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Providers from "@/providers";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kakalinks.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Kakalinks | Instant Airtime, Data & Bill Payments",
    template: "%s | Kakalinks",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kakalinks",
  },
  description:
    "Join thousands of agents. Earn commissions on data, electricity, and cable TV subscriptions.",
  keywords: [
    "Cheap Data Nigeria",
    "Pay KPLC Kenya",
    "VTU Business",
    "WAEC Pins",
    "Earn Commission on Data",
    "Airtime to Cash",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Kakalinks",
    title: "Kakalinks | The Most Reliable Payment Network", // Specific social title
    description:
      "Earn commissions on every transaction. The most reliable VTU platform for agents.",
    images: [
      {
        url: "/og-image.png", // Next.js will prefix with metadataBase automatically
        width: 1200,
        height: 630,
        alt: "Kakalinks Agent Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kakalinks | Payments & Commissions",
    description:
      "Join thousands of agents across Africa. Fast, secure, and rewarding.",
    images: ["/og-image.png"],
    creator: "@kakalinks",
    site: "@kakalinks", // Add the site handle too
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
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#d4af37" },
    ],
  },

  // 4. ADD: Manifest file link
  manifest: `${baseUrl}/manifest.json`,
};

export const viewport = {
  themeColor: "#0a0a0a", // Set this to your brand black or brand gold
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${instrumentSans.variable} antialiased font-instrument bg-background text-foreground transition-colors duration-300`}
      >
        <Providers>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}

              <Toaster
                position="bottom-right"
                reverseOrder={false}
                toastOptions={{
                  // The Base Style
                  style: {
                    border: "1px solid rgba(212, 175, 55, 0.2)", // Subtle gold border
                    padding: "16px",
                    color: "var(--foreground)",
                    background: "var(--background)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "20px", // Match your rounded-3xl/4xl aesthetic
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "-0.01em",
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  },
                  success: {
                    duration: 4000,
                    iconTheme: {
                      primary: "#D4AF37", // Brand Gold
                      secondary: "white",
                    },
                    style: {
                      border: "1px solid rgba(34, 197, 94, 0.2)", // Subtle green for success
                    },
                  },
                  error: {
                    duration: 5000,
                    style: {
                      border: "1px solid rgba(239, 68, 68, 0.2)", // Subtle red for error
                    },
                  },
                }}
              />
            </ThemeProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
