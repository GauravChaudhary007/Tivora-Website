import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tivora ERP — One platform. Every business.",
  description:
    "Tivora ERP by HiTech connects sales, purchase, manufacturing, inventory, finance, planning, maintenance, trade and tax in one intelligent, IRD certified platform.",
  icons: { icon: "/brand/tivora-symbol.svg" },
  openGraph: {
    title: "Tivora ERP — One platform. Every business.",
    description:
      "The intelligent ERP from HiTech Solutions and Services, Kathmandu. Multi-company, multi-branch, automated end to end.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#141C3D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrains.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
