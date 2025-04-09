export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      <h1 className="text-3xl font-bold">AI CV Review</h1>
      <p className="text-gray-600 mt-2">이력서를 업로드하고 AI의 피드백을 받아보세요.</p>
      <a href="/upload" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        CV Feedback
      </a>
      <a href="/review" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Results
      </a>
      <a href="/humanizer" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Humanizer
      </a>
      <a href="/compare" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        Text Compare
      </a>
      <a href="/ielts" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
        IELTS
      </a>
    </main>
  );
}
