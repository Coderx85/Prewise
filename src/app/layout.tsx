import { Toaster } from 'sonner';
import type { Metadata } from 'next';
import { Mona_Sans } from 'next/font/google';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import ErrorBoundary from '@/components/ErrorBoundary';

const monaSans = Mona_Sans({
  variable: '--font-mona-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PrepWise',
  description: 'An AI-powered platform for preparing for mock interviews',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased pattern`}>
        <ClerkProvider>
          <ErrorBoundary>
            <main>
              {children}
              <Toaster position={'bottom-right'} />
            </main>
          </ErrorBoundary>
        </ClerkProvider>
      </body>
    </html>
  );
}
