"use client";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10">
      {/* 브랜드 이름 + 설명 */}
      <h1 className="text-4xl font-bold text-gray-800 mb-2">🚀 BuildU</h1>
      <p className="text-gray-600 text-center text-lg mb-2">BuildU helps you stand out.</p>
      <p className="text-gray-500 text-center max-w-xl mb-8">
        <strong>BuildU</strong> stands for <em>"Build You"</em>. It’s your personal AI dashboard for crafting better writing, smarter applications, and clearer communication.
      </p>

      {/* 섹션 1: Writing & Editing Tools */}
      <div className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">📄 Writing & Editing Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <ToolCard
            title="🧠 Humanizer"
            description="Rewrite AI-sounding text to make it more natural and undetectable."
            href="/humanizer"
          />
          <ToolCard
            title="🔍 Text Compare"
            description="Compare two versions of text and highlight the differences."
            href="/compare"
          />
          <ToolCard
            title="✍️ IELTS"
            description="Practice and analyze your IELTS Writing tasks."
            href="/ielts"
          />
        </div>

        {/* 섹션 2: CV Review Tools */}
        <h2 className="text-xl font-semibold text-gray-700 mb-3">📑 CV Review Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToolCard
            title="📤 CV Feedback"
            description="Upload your CV and get AI-powered suggestions."
            href="/upload"
          />
          <ToolCard
            title="📊 Results"
            description="View and track your CV feedback results."
            href="/review"
          />
        </div>
      </div>
    </main>
  );
}

// 컴포넌트 추출: 카드형 UI
function ToolCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <a
        href={href}
        className="inline-block text-blue-600 text-sm font-medium hover:underline"
      >
        Try now →
      </a>
    </div>
  );
}