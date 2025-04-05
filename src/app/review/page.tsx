"use client";

import { useEffect, useState, useRef } from "react";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { marked } from "marked";
import { registerMalgunGothic } from "@/utils/pdfFonts";
import {
  loadStoredItems,
  saveStoredItem,
  deleteStoredItem,
} from "@/utils/storage";

interface Feedback {
  id: string;
  text: string;
}

const FEEDBACK_KEY = "saved_ai_feedbacks";

export function markdownToPlainText(markdown: string): string {
  const html = marked.parse(markdown) as string;
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;
  return tempElement.textContent || "";
}

export default function Review() {
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState("");
  const [savedFeedbacks, setSavedFeedbacks] = useState<Feedback[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem("ai_feedback");
    if (stored) {
      const clean = stored.startsWith('"') && stored.endsWith('"')
        ? stored.slice(1, -1)
        : stored;
      setFeedback(clean.replace(/\\n/g, "\n"));
    }
    setSavedFeedbacks(loadStoredItems<Feedback>(FEEDBACK_KEY));
  }, []);

  const handleSave = () => {
    const id = title.trim() || new Date().toISOString();
    const newItem: Feedback = { id, text: feedback };
    const updated = saveStoredItem(FEEDBACK_KEY, newItem);
    setSavedFeedbacks(updated);
    setTitle(id);
  };

  const handleLoad = (id: string) => {
    const selected = savedFeedbacks.find((fb) => fb.id === id);
    if (selected) {
      setTitle(selected.id);
      setFeedback(selected.text);
    }
  };

  const handleDelete = (id: string) => {
    const updated = deleteStoredItem<Feedback>(FEEDBACK_KEY, id);
    setSavedFeedbacks(updated);
  };

  const handleDownloadPDF = () => {
    if (!feedback) return alert("There is no AI feedback😱");

    const doc = new jsPDF();

    registerMalgunGothic(doc); // 👉 한글 폰트 적용
    // doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("AI Resume Feedback", 20, 20);

    const margin = 20;
    const pageWidth = doc.internal.pageSize.width - margin * 2;
    const plainText = markdownToPlainText(feedback);
    const textLines = doc.splitTextToSize(plainText, pageWidth);

    doc.text(textLines, margin, 40);
    doc.save("AI_Resume_Feedback.pdf");
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-8xl mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <h1 className="text-2xl font-semibold">AI Feedback Result</h1>
          <input
            className="border rounded px-4 py-2 w-full sm:w-1/4"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            저장 💾
          </button>
          <button onClick={handleDownloadPDF} className="bg-green-500 text-white px-4 py-2 rounded">
            PDF 다운로드 📄
          </button>
          {isMounted && savedFeedbacks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <select
                ref={selectRef}
                className="border p-2 rounded"
                onChange={(e) => handleLoad(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  저장된 피드백 불러오기
                </option>
                {savedFeedbacks.map((fb) => (
                  <option key={fb.id} value={fb.id}>
                    {`${fb.id} (${fb.text.trim().split(/\s+/).length} words)`}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  const id = selectRef.current?.value;
                  if (id) handleDelete(id);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded w-fit"
              >
                삭제 ❌
              </button>
            </div>
          )}
        </div>
      </div>

      {feedback ? (
        <div className="mt-6 w-full max-w-4xl bg-white p-4 border rounded-md shadow-md">
          <h2 className="text-xl font-semibold">AI Feedback</h2>
          <ReactMarkdown
            className="mt-2 text-gray-700 whitespace-pre-wrap"
            rehypePlugins={[rehypeRaw]}
          >
            {feedback}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="text-gray-500">Feedback is coming...</p>
      )}
    </main>
  );
}