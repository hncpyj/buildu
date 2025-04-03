"use client";

import { useState, useEffect, useRef } from "react";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const TEMP_KEY = "ielts_temp_latest";

export default function Ielts() {
  const [title, setTitle] = useState("");
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [newStats, setNewStats] = useState({ words: 0, chars: 0 });

  const [savedTasks, setSavedTasks] = useState<{
    title: string;
    task: string;
    answer: string;
    feedback: string | null;
    savedAt: string;
  }[]>([]);

  const textareaARef = useRef<HTMLTextAreaElement>(null);
  const textareaBRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const saved = localStorage.getItem(TEMP_KEY);
    if (saved) {
      const temp = JSON.parse(saved);
      if (temp.oldText) setOldText(temp.oldText);
      if (temp.newText) setNewText(temp.newText);
      if (temp.title) setTitle(temp.title);
    }

    const stored = localStorage.getItem("ielts_saved_tasks");
    if (stored) {
      setSavedTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const temp = { oldText, newText, title };
      localStorage.setItem(TEMP_KEY, JSON.stringify(temp));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [oldText, newText, title]);

  useEffect(() => {
    setNewStats({
      words: newText.trim().split(/\s+/).filter(Boolean).length,
      chars: newText.length,
    });
  }, [newText]);

  const handleSave = () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    const existingIndex = savedTasks.findIndex((t) => t.title === title);

    const newEntry = {
      title,
      task: oldText,
      answer: newText,
      feedback: aiFeedback,
      savedAt: new Date().toISOString(),
    };

    let updatedTasks;
    if (existingIndex >= 0) {
      if (!confirm("같은 제목이 있습니다. 덮어쓸까요?")) return;
      updatedTasks = [...savedTasks];
      updatedTasks[existingIndex] = newEntry;
    } else {
      updatedTasks = [...savedTasks, newEntry];
    }

    setSavedTasks(updatedTasks);
    localStorage.setItem("ielts_saved_tasks", JSON.stringify(updatedTasks));
    alert("저장 완료!");
  };

  const handleLoad = (selectedTitle: string) => {
    const selected = savedTasks.find((t) => t.title === selectedTitle);
    if (selected) {
      setTitle(selected.title);
      setOldText(selected.task);
      setNewText(selected.answer);
      setAiFeedback(selected.feedback);
    }
  };

  const handleDelete = (selectedTitle: string) => {
    const filtered = savedTasks.filter((t) => t.title !== selectedTitle);
    setSavedTasks(filtered);
    localStorage.setItem("ielts_saved_tasks", JSON.stringify(filtered));
  };

  const handleSubmit = async () => {
    if (!newText.trim()) return alert("답안을 입력해주세요.");
    setLoading(true);
    const res = await fetch("/api/ielts-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ essayText: newText }),
    });
    const data = await res.json();
    setAiFeedback(data.feedback);
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-8xl mb-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <h1 className="text-2xl font-semibold">ielts practice</h1>
          <input
            className="border rounded px-4 py-2 w-full sm:w-1/4"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            저장 💾
          </button>
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
            제출 🧠
          </button>
          <button onClick={() => setIsRunning(true)} className="bg-yellow-500 text-white px-4 py-2 rounded">
            {/* 타이머 시작 ⏱️ */}
            🕒 {formatTime(timeLeft)}
          </button>
          {/* <div className="text-lg font-bold text-red-600">
            🕒 {formatTime(timeLeft)}
          </div> */}
          {savedTasks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <select
                className="border p-2 rounded"
                onChange={(e) => handleLoad(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  저장된 문제 불러오기
                </option>
                {savedTasks.map((t) => (
                  <option key={t.title} value={t.title}>
                    {`${t.title} (${t.answer.trim().split(/\s+/).length} words, ${new Date(t.savedAt).toLocaleDateString()})`}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleDelete(title)}
                className="bg-red-500 text-white px-4 py-2 rounded w-fit"
              >
                삭제 ❌
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && <p className="text-blue-600 font-semibold">🌀 AI가 채점 중입니다...</p>}

      {aiFeedback && (
        <div className="flex flex-col w-full">
          <div className="bg-gray-200 text-lg font-bold py-2 px-4 rounded-t-md">AI Feedback</div>
          <div className="w-full bg-white border rounded-md p-4 mb-6 text-gray-800 whitespace-pre-wrap">
            {aiFeedback}
          </div>
        </div>
      )}

      <div className="flex flex-row gap-4 w-full max-w-8xl mb-6">
        <div className="flex flex-col w-4/12">
          <div className="bg-gray-200 text-lg font-bold py-2 px-4 rounded-t-md">Task</div>
          <textarea
            ref={textareaARef}
            className="resize-none w-full p-4 border rounded-b-md mb-4 min-h-[640px]"
            placeholder="문제 입력"
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-8/12">
          <div className="bg-gray-200 text-lg font-bold py-2 px-4 rounded-t-md flex justify-between">
            <span>Write here</span>
            <span className="text-sm font-medium text-right text-gray-600">
              {newStats.words} words / {newStats.chars} chars
            </span>
          </div>
          <textarea
            ref={textareaBRef}
            className="resize-none w-full p-4 border border-t-0 rounded-b-md min-h-[640px]"
            placeholder="답안 작성"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        </div>
      </div>
    </main>
  );
}
