import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image"; // ✅ 이미지 컴포넌트 추가
import "./globals.css";

// 🔹 폰트 설정
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🔹 메타데이터
export const metadata: Metadata = {
  title: "BuildU",
  description: "Your personal AI writing and CV assistant",
};

// 🔹 레이아웃 컴포넌트
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-text`}
      >
        {/* 🔹 상단 네비게이션 바 */}
        <nav className="w-full bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex gap-6 items-center text-lg font-semibold text-black">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <Image src="/BuildULogo.png" alt="BuildU Logo" width={130} height={78} />
            </Link>
            <Link href="/upload" className="hover:text-blue-500">CV Feedback</Link>
            <Link href="/review" className="hover:text-blue-500">Results</Link>
            <Link href="/humanizer" className="hover:text-blue-500">Humanizer</Link>
            <Link href="/compare" className="hover:text-blue-500">Text Compare</Link>
            <Link href="/ielts" className="hover:text-blue-500">IELTS</Link>
          </div>
        </nav>

        {/* 🔹 본문 */}
        <main>{children}</main>
      </body>
    </html>
  );
}