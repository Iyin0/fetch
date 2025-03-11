import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import Providers from "@/app/providers/providers";
import { Analytics } from "@vercel/analytics/react"

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Fetch',
  description: 'Help a dog find a home today!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} antialiased`}
      >
        <Providers>
          {children}
          <Toaster richColors/>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
