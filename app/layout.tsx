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
      {/* Anti-FOUC: apply stored theme before first paint */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('nexly-theme');if(t!=='light'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
