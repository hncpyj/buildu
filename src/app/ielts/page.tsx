"use client";

import { useState, useEffect, useRef } from "react";
import { formatTime } from "@/utils/time";
import {
  loadTempData,
  saveTempData,
  loadStoredItems,
  saveStoredItem,
  deleteStoredItem,
} from "@/utils/storage";
import { getNewStats } from "@/utils/stats";

interface SavedTask {
  id: string;
  title: string;
  task: string;
  answer: string;
  feedback: string | null;
  savedAt: string;
}

const TEMP_KEY = "ielts_temp_latest";
const TASKS_KEY = "ielts_saved_tasks";

export default function Ielts() {
  const [title, setTitle] = useState("");
  const [oldTextHtml, setOldTextHtml] = useState("");
  const [newText, setNewText] = useState("");
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [newStats, setNewStats] = useState({ words: 0, chars: 0 });
  const [savedTasks, setSavedTasks] = useState<SavedTask[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const taskDivRef = useRef<HTMLDivElement>(null);
  const textareaBRef = useRef<HTMLTextAreaElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const temp = loadTempData<{
      oldTextHtml: string;
      newText: string;
      title: string;
    }>(TEMP_KEY);
    if (temp) {
      setOldTextHtml(temp.oldTextHtml || "");
      setNewText(temp.newText || "");
      setTitle(temp.title || "");
    }

    const raw = loadStoredItems<unknown>(TASKS_KEY);
    const patched: SavedTask[] = (raw as SavedTask[]).map((item) => ({
      ...item,
      id: item.id ?? (item as SavedTask).title,
    }));
    setSavedTasks(patched);
  }, []);

  useEffect(() => {
    const timer = isRunning
      ? setInterval(() => {
          setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
        }, 1000)
      : undefined;
    return () => timer && clearInterval(timer);
  }, [isRunning]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveTempData(TEMP_KEY, { oldTextHtml, newText, title });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [oldTextHtml, newText, title]);

  useEffect(() => {
    setNewStats(getNewStats(newText));
  }, [newText]);

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    for (const item of e.clipboardData.items) {
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement("img");
          img.src = event.target?.result as string;
          img.className = "max-w-full my-2";
          taskDivRef.current?.appendChild(img);
        };
        reader.readAsDataURL(file!);
        e.preventDefault();
      }
    }
  };

  const handleSave = () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    const newTask: SavedTask = {
      id: title.trim(),
      title,
      task: oldTextHtml,
      answer: newText,
      feedback: aiFeedback,
      savedAt: new Date().toISOString(),
    };
    const updated = saveStoredItem<SavedTask>(TASKS_KEY, newTask);
    setSavedTasks(updated);
  };

  const handleLoad = (selectedId: string) => {
    const selected = savedTasks.find((t) => t.id === selectedId);
    if (selected) {
      setTitle(selected.title);
      setOldTextHtml(selected.task);
      setNewText(selected.answer);
      setAiFeedback(selected.feedback);
    }
  };

  const handleDelete = (selectedId: string) => {
    const updated = deleteStoredItem<SavedTask>(TASKS_KEY, selectedId);
    setSavedTasks(updated);
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
            🕒 {formatTime(timeLeft)}
          </button>

          {isMounted && savedTasks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <select
                ref={selectRef}
                className="border p-2 rounded"
                onChange={(e) => handleLoad(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  저장된 문제 불러오기
                </option>
                {savedTasks.map((t) => (
                  <option key={`${t.id}-${t.savedAt}`} value={t.id}>
                    {`${t.title} (${t.answer.trim().split(/\s+/).length} words, ${new Date(
                      t.savedAt
                    ).toLocaleDateString()})`}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  const selectedId = selectRef.current?.value;
                  if (selectedId) handleDelete(selectedId);
                }}
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
          <div
            ref={taskDivRef}
            className="resize-none w-full p-4 border rounded-b-md mb-4 min-h-[640px] bg-white overflow-auto"
            contentEditable
            onPaste={handlePaste}
            onInput={(e) => setOldTextHtml(e.currentTarget.innerHTML)}
            dangerouslySetInnerHTML={{ __html: oldTextHtml }}
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
