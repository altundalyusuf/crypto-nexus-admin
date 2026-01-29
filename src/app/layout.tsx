import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from "@/store/ReduxProvider";
import ThemeRegistry from "@/lib/ThemeRegistry";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Nexus Admin",
  description: "Enterprise Backoffice Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* WRAPPER ORDER IS CRITICAL:
          1. ReduxProvider: Wraps the entire app to provide the Redux Store context.
          2. ThemeRegistry: Wraps the app to inject MUI styles and handle SSR caching.
        */}
        <ReduxProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}
