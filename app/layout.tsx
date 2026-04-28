import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "./_client-providers";

export const metadata: Metadata = {
  title: "Nexly - Connect Brands with Influencers",
  description:
    "Connect brands with content creators across TikTok, YouTube, and Instagram.",
  openGraph: {
    title: "Nexly - Connect Brands with Influencers",
    description: "The influencer and brand collaboration marketplace.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
