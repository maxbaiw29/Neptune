import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Neptune — Personal Portfolio", description: "A private, local-first portfolio overview." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
