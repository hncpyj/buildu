"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 flex flex-col items-center">
      {/* <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 BuildU</h1> */}
      <Link href="/" className="flex items-center hover:opacity-80 transition">
        <Image src="/BuildULogo.png" alt="BuildU Logo" width={250} height={150} />
      </Link>
      <p className="text-gray-500 text-center max-w-xl mb-8">
        <strong>BuildU</strong> stands for <em>&quot;Build You&quot;</em>. Your personal AI dashboard for crafting better writing, smarter applications, and clearer communication.
      </p>

      <Link
        href="/upload"
        className="mb-10 inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md shadow transition"
      >
        Get Started
      </Link>

      {/* Top Section: CV Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {[
          {
            title: "📤 CV Feedback",
            description: "Upload your CV and get AI-powered suggestions.",
            href: "/upload",
            color: "text-blue-600",
          },
          {
            title: "📊 Results Analysis",
            description: "View and track your CV feedback results.",
            href: "/review",
            color: "text-purple-600",
          },
          {
            title: "🧠 Humanizer",
            description: "Rewrite AI-sounding text to make it more natural and undetectable.",
            href: "/humanizer",
            color: "text-blue-600",
          },
        ].map(({ title, description, href, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition block"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-1">{title}</h2>
            <p className="text-gray-500 text-sm mb-2">{description}</p>
            <span className={`text-sm ${color} hover:underline`}>Try now →</span>
          </Link>
        ))}
      </div>

      {/* Bottom Section: Writing Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mt-6">
        {[
          {
            title: "🔍 Text Compare",
            description: "Compare two versions of text and highlight the differences.",
            href: "/compare",
            color: "text-green-600",
          },
          {
            title: "✍️ IELTS Practice",
            description: "Practice and analyze your IELTS Writing tasks.",
            href: "/ielts",
            color: "text-orange-600",
          },
        ].map(({ title, description, href, color }) => (
          <Link
            key={href}
            href={href}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition block"
          >
            <h2 className="text-base font-semibold flex items-center gap-2 mb-1">{title}</h2>
            <p className="text-gray-500 text-sm">{description}</p>
            <span className={`text-sm ${color} hover:underline block mt-1`}>→ Open</span>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-400 text-center">
        © 2025 BuildU. All rights reserved.
      </footer>
    </main>
  );
}