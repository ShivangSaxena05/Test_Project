
import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Project Teja',
  description: 'Professional translation, transcription, and voice-over services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-blue-400">
                  Project Teja
                </Link>
              </div>
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
                <Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link>
              </div>
            </div>
          </div>
        </nav>
        
        {children}
        
        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2026 Project Teja. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

