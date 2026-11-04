import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Key Passage",
  description: "Read the passage. Open the door.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
