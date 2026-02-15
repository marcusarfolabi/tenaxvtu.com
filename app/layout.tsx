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
    title: "Kakalinks | Instant Airtime & Bill Payments",
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
    title: "Kakalinks | Instant Airtime & Bill Payments",
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
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
        className={`${instrumentSans.variable} antialiased font-instrument`}
      >
        <Providers>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
            <Toaster
              position="bottom-right"
              reverseOrder={false}
              toastOptions={{
                style: {
                  border: "1px solid var(--color-brand-gold)",
                  padding: "14px",
                  color: "#FFFFFF",
                  background: "var(--color-brand-black)",
                  borderRadius: "8px",
                  fontSize: "14px",
                },
                success: {
                  duration: 4000,
                  iconTheme: {
                    primary: "var(--color-brand-gold)",
                    secondary: "var(--color-brand-black)",
                  },
                  style: {
                    border: "1px solid #D4AF37",
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    border: "1px solid #FF4B4B",
                    background: "#0A0A0A",
                  },
                },
              }}
            />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
