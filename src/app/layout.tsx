import type { Metadata } from "next";
import { Baloo_2, Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

const baloo2 = Baloo_2({
  variable: "--font-baloo-2",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduPlatform - Mastery Learning",
  description: "Foundational knowledge and core mastery platform.",
};

import { getGamificationProfile } from "@/app/dashboard/actions";
import { GamificationHUD } from "@/components/gamification/GamificationHUD";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gamificationProfile = await getGamificationProfile();

  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} ${baloo2.variable} antialiased`}
      >
        {gamificationProfile && (
          <GamificationHUD
            xp={gamificationProfile.xp || 0}
            streak={gamificationProfile.streak_current || 0}
          />
        )}
        {children}
      </body>
    </html>
  );
}
