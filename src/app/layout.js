import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: 'Jeev Rakshak | Animal Rescue',
  description: 'AI-Powered Stray Animal Rescue & Alert System. Helping injured animals get immediate medical attention.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <Navbar />
        <main style={{ paddingTop: '135px' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
