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
    title: "Kakalinks",
    description:
      "Earn commissions on every transaction. The most reliable VTU platform for agents.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kakalinks Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kakalinks",
    description:
      "Join thousands of agents. Earn commissions on data, electricity, and cable TV subscriptions.",
    images: ["/og-image.png"],
    creator: "@kakalinks",
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
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
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
