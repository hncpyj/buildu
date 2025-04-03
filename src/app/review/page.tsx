"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function Review() {
    const [feedback, setFeedback] = useState("");
    const [savedFeedbacks, setSavedFeedbacks] = useState<{ id: string, text: string }[]>([]);
    const [selectedFeedback] = useState<string>("");

    useEffect(() => {
        const storedFeedback = localStorage.getItem("ai_feedback");
        if (storedFeedback) setFeedback(storedFeedback);

        const saved = JSON.parse(localStorage.getItem("saved_ai_feedbacks") || "[]");
        setSavedFeedbacks(saved);
    }, []);

    // ✅ 여러 개 저장 가능하도록 개선
    const handleSaveFeedback = () => {
        if (!feedback) return alert("No AI feedback to save!");
        
        const newFeedback = {
            id: new Date().toISOString(), // 고유한 ID (날짜 기반)
            text: feedback
        };

        const updatedFeedbacks = [...savedFeedbacks, newFeedback];
        setSavedFeedbacks(updatedFeedbacks);
        localStorage.setItem("saved_ai_feedbacks", JSON.stringify(updatedFeedbacks));

        alert("Feedback saved successfully! ✅");
    };

    // ✅ 저장된 피드백 중 선택해서 불러오기
    const handleLoadFeedback = (id: string) => {
        const selected = savedFeedbacks.find(fb => fb.id === id);
        if (selected) {
            setFeedback(selected.text);
            alert("Selected feedback loaded! ✅");
        }
    };

    // ✅ 특정 피드백 삭제 기능 추가
    const handleDeleteFeedback = (id: string) => {
        const updatedFeedbacks = savedFeedbacks.filter(fb => fb.id !== id);
        setSavedFeedbacks(updatedFeedbacks);
        localStorage.setItem("saved_ai_feedbacks", JSON.stringify(updatedFeedbacks));
    };

    // PDF 다운로드
    const handleDownloadPDF = () => {
        if (!feedback) return alert("There is no AI feedback😱");

        const doc = new jsPDF({
            orientation: "p",
            unit: "mm",
            format: "a4"
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.text("AI Resume Feedback", 20, 20);

        const margin = 20;
        const pageWidth = doc.internal.pageSize.width - margin * 2;
        const textLines = doc.splitTextToSize(feedback, pageWidth);

        doc.text(textLines, margin, 40);
        doc.save("AI_Resume_Feedback.pdf");
    };

    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-semibold">AI Feedback Result</h1>

            <div className="mt-4 flex justify-center gap-4">
                <button
                    onClick={handleDownloadPDF}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg"
                >
                    PDF Download 📄
                </button>
                <button
                    onClick={handleSaveFeedback}
                    className="px-6 py-3 bg-yellow-500 text-white rounded-lg"
                >
                    Save Feedback 💾
                </button>
            </div>

            {/* ✅ 저장된 피드백 목록 */}
            {savedFeedbacks.length > 0 && (
                <div className="mt-6 w-full max-w-xl bg-white p-4 border rounded-md shadow-md">
                    <h2 className="text-lg font-semibold mb-2">Saved Feedbacks</h2>
                    <select
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => handleLoadFeedback(e.target.value)}
                        value={selectedFeedback}
                    >
                        <option value="">Select a feedback</option>
                        {savedFeedbacks.map((fb) => (
                            <option key={fb.id} value={fb.id}>
                                {new Date(fb.id).toLocaleString()}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => handleDeleteFeedback(selectedFeedback)}
                        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
                        disabled={!selectedFeedback}
                    >
                        Delete Selected ❌
                    </button>
                </div>
            )}

            {/* 피드백 표시 */}
            {feedback ? (
                <div className="mt-6 w-full max-w-xl bg-white p-4 border rounded-md shadow-md">
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
