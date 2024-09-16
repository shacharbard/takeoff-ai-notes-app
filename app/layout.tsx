import { createProfileAction } from "@/actions/profiles-actions";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/utilities/providers";
import { getProfileByUserId } from "@/db/queries/profiles-queries";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Notes App",
  description: "A simple AI Notes App",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = auth();

  if (userId) {
    const profile = await getProfileByUserId(userId);
    if (!profile) {
      await createProfileAction({ userId });
    }
  }

  return (
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <ClerkProvider>
            <Providers attribute="class" disableTransitionOnChange>
              <Header />
              {children}
              <Toaster />
            </Providers>
          </ClerkProvider>
        </body>
      </html>
      
  );
}
