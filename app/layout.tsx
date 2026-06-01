import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus' });

export const metadata: Metadata = {
  title: 'QuKao Exam Learning Platform',
  description: 'A mobile-first, cardless learning platform built with Next.js and Firebase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#F3F4F9] text-[#1B1B1F] font-sans antialiased min-h-screen" suppressHydrationWarning>
        <AuthProvider>
          <div className="w-full min-h-screen relative bg-[#F3F4F9]">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
