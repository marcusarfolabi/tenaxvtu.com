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

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tenaxvtu.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Tenax Telecoms | Connecting the Globe",
    template: "%s | Tenax Telecoms",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tenax Telecoms",
  },
  description:
    "Instant airtime, data, and bill payments. Join the most reliable VTU network for agents and individuals.",
  keywords: [
    "Tenax Telecoms",
    "Cheap Data Nigeria",
    "VTU Business",
    "Airtime to Cash",
    "Bill Payments Africa",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Tenax Telecoms",
    title: "Tenax Telecoms | Reliable Payment Network",
    description:
      "Connecting the globe with instant VTU services and commission-based agent opportunities.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tenax Telecoms" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tenax Telecoms | Payments & Connectivity",
    description: "Fast, secure, and rewarding VTU services across the globe.",
    images: ["/og-image.png"],
    creator: "@tenaxtelecoms",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon-180x180.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#8B1A1A" }],
  },
  manifest: `${baseUrl}/manifest.json`,
};

export const viewport = {
  themeColor: "#8B1A1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={instrumentSans.variable}>
        <Providers>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    border: "1px solid rgba(139, 26, 26, 0.2)",
                    padding: "16px",
                    color: "var(--foreground)",
                    background: "var(--background)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "16px",
                    fontSize: "13px",
                    fontWeight: "700",
                    letterSpacing: "-0.01em",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  },
                  success: {
                    duration: 4000,
                    iconTheme: { primary: "#8B1A1A", secondary: "white" },
                    style: { border: "1px solid rgba(34, 197, 94, 0.2)" },
                  },
                  error: {
                    duration: 5000,
                    style: { border: "1px solid rgba(239, 68, 68, 0.2)" },
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