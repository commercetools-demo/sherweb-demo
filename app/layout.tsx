import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Sherweb Partner Portal | Cloud Marketplace',
  description: 'Sherweb\'s next-generation cloud marketplace for MSPs and resellers. Powered by commercetools.',
  keywords: 'cloud marketplace, MSP portal, Microsoft 365, B2B cloud, Sherweb',
  openGraph: {
    title: 'Sherweb Partner Portal',
    description: 'Your one-stop cloud marketplace for Microsoft and multi-vendor solutions.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
