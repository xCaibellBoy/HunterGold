import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google"; // Import Roboto Mono
import "../styles/globals.css"; // Import global styles

// Configure Roboto Mono
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: '--font-roboto-mono', // Optional: if you want to use it as a CSS variable
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HunterGold",
  description: "HunterGold Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={robotoMono.className}> {/* Apply font class to html */}
      <body>{children}</body>
    </html>
  );
}
