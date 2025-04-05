// src/app/upload/page.tsx

"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { saveTempData } from "@/utils/storage";

export default function Upload() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setResumeText("파일 처리 중...");

      const text = await extractTextFromDocx(file);
      setResumeText(text);
    },
  });

  async function extractTextFromDocx(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) return reject("파일을 읽을 수 없습니다.");
        const arrayBuffer = event.target.result as ArrayBuffer;
        const mammoth = await import("mammoth");
        mammoth
          .extractRawText({ arrayBuffer })
          .then((result) => resolve(result.value))
          .catch(reject);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  const handleSubmit = async () => {
    if (!resumeText.trim()) return alert("텍스트를 입력하거나 파일을 업로드하세요");

    setLoading(true);
    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.feedback) {
      localStorage.setItem("ai_feedback", data.feedback);
      saveTempData("ai_feedback", data.feedback);
      window.location.href = "/review";
    } else {
      alert("AI 피드백을 받을 수 없습니다.");
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-4">Upload CV</h1>

      <button
        onClick={handleSubmit}
        className="mt-4 mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 justify-center"
        disabled={loading}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span>AI 분석 중...</span>
          </>
        ) : (
          <span>AI 첨삭 받기</span>
        )}
      </button>

      <div
        {...getRootProps()}
        className="border-4 border-dashed p-10 rounded-lg text-center cursor-pointer mb-4 w-full max-w-2xl bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center"
      >
        <input {...getInputProps()} />
        {uploadedFile ? (
          <p className="text-green-600">{uploadedFile.name} 업로드 완료 ✅</p>
        ) : (
          <p className="text-gray-500">
            자동 텍스트 추출을 위해 <br /> DOCX 파일을 <br /> 여기로 드래그하거나 클릭하여 업로드
          </p>
        )}
      </div>

      <textarea
        className="mt-4 mb-4 w-full max-w-2xl bg-white p-4 border rounded-md shadow-md h-80"
        placeholder="텍스트를 입력하세요"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />
    </main>
  );
}