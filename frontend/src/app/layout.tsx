import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AI-Solutions | Intelligent Software for the Digital Workplace",
    template: "%s | AI-Solutions",
  },
  description:
    "AI-Solutions is a Sunderland-based AI startup leveraging cutting-edge artificial intelligence to accelerate design, engineering and innovation across industries.",
  keywords: [
    "AI Solutions",
    "artificial intelligence",
    "digital employee experience",
    "AI virtual assistant",
    "software solutions",
    "Sunderland",
  ],
  authors: [{ name: "AI-Solutions" }],
  creator: "AI-Solutions",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "AI-Solutions",
    title: "AI-Solutions | Intelligent Software for the Digital Workplace",
    description:
      "Leveraging AI to proactively address issues that impact the digital employee experience.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster
              position="bottom-right"
              expand
              richColors
              closeButton
              toastOptions={{
                className: "toaster-glass",
              }}
            />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
