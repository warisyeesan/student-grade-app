import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Nabla } from "next/font/google";
import "./globals.css";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-ibm-plex-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const nabla = Nabla({
  variable: "--font-nabla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ผลการทดสอบ | Prateepsassana Islamic School",
  description: "ระบบตรวจสอบผลการทดสอบ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${ibmPlexSansThai.variable} ${nabla.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-ibm-plex-sans-thai), sans-serif' }}>{children}</body>
    </html>
  );
}
