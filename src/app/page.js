import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Project Teja
        </h1>
        <p className="text-xl text-blue-200 mb-8">
          Professional Services
        </p>
        <Link 
          href="/contact" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </main>
  );
}

