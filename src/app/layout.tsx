import { Outfit } from 'next/font/google';
import './globals.css';
import {Metadata} from "next"

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/sonner';

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_DEFAULT_TITLE?? "", // fallback title kalau page nggak set
    template: "%s " + process.env.NEXT_PUBLIC_SUFFIX_TITLE, // %s = title dari tiap page
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <Toaster position='top-center' />
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
