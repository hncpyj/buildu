"use client";

import { useState, useEffect, useRef } from "react";
import { diffWords, Change } from "diff";

export default function Compare() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const [oldStats, setOldStats] = useState({ words: 0, chars: 0 });
  const [newStats, setNewStats] = useState({ words: 0, chars: 0 });

  const textareaARef = useRef<HTMLTextAreaElement>(null);
  const textareaBRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const syncHeight = () => {
    const aHeight = textareaARef.current?.scrollHeight || 0;
    const bHeight = textareaBRef.current?.scrollHeight || 0;
    const hHeight = highlightRef.current?.scrollHeight || 0;

    const maxHeight = Math.max(aHeight, bHeight, hHeight);

    if (textareaARef.current) textareaARef.current.style.height = `${maxHeight}px`;
    if (textareaBRef.current) textareaBRef.current.style.height = `${maxHeight}px`;
    if (highlightRef.current) highlightRef.current.style.height = `${maxHeight}px`;
  };

  useEffect(() => {
    syncHeight();
  }, [oldText, newText, highlighted]);

  useEffect(() => {
    setOldStats({
      words: oldText.trim().split(/\s+/).filter(Boolean).length,
      chars: oldText.length,
    });
  }, [oldText]);

  useEffect(() => {
    setNewStats({
      words: newText.trim().split(/\s+/).filter(Boolean).length,
      chars: newText.length,
    });
  }, [newText]);

  const handleCompare = () => {
    if (!oldText.trim() || !newText.trim()) {
      return alert("두 개의 문서를 입력하거나 업로드하세요!");
    }

    const changes: Change[] = diffWords(oldText, newText);

    const highlightedResult = changes
      .map((part) => {
        if (part.removed) return `<span class='line-through'>${part.value}</span>`;
        if (part.added) return `<span class='bg-yellow-300 px-1'>${part.value}</span>`;
        return part.value;
      })
      .join("");

    setHighlighted(highlightedResult);
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Text Comparison</h1>

      <button
        onClick={handleCompare}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg mb-6 flex items-center gap-2 justify-center"
      >
        Compare 🔍
      </button>

      {/* 💡 박스들을 가로 정렬 */}
      <div className="flex flex-row gap-4 w-full max-w-8xl mb-6">
        {/* 문서 A */}
        <div className="flex flex-col w-full">
          {/* <div className="bg-gray-200 text-center text-lg font-bold py-2 rounded-t-md">
            A ({oldStats.words} words / {oldStats.chars} chars)
          </div> */}
          <div className="bg-gray-200 text-lg font-bold py-2 px-4 rounded-t-md flex justify-between">
            <span>Before</span>
            <span className="text-sm font-medium text-right text-gray-600">
              {oldStats.words} words / {oldStats.chars} chars
            </span>
          </div>

          <textarea
            ref={textareaARef}
            className="resize-none w-full p-4 border rounded-b-md mb-4 min-h-[320px]"
            placeholder="문서 A 입력"
            value={oldText}
            onChange={(e) => setOldText(e.target.value)}
          />
        </div>

        {/* 결과 */}
        <div className="flex flex-col w-full">
          {/* <div className="bg-gray-200 text-center text-lg font-bold py-2 rounded-t-md"> */}
          <div className="bg-gray-200 text-lg font-bold py-2 px-4 rounded-t-md text-center">
            Changes
          </div>
          <div
            ref={highlightRef}
            className="resize-none w-full p-4 border border-t-0 rounded-b-md mb-4 bg-gray-50 overflow-y-auto whitespace-pre-wrap min-h-[320px]"
            contentEditable={false}
            dangerouslySetInnerHTML={{ __html: highlighted || oldText }}
          />
        </div>

        {/* 문서 B */}
        <div className="flex flex-col w-full">
          {/* <div className="bg-gray-200 text-center text-lg font-bold py-2 rounded-t-md">
            B ({newStats.words} words / {newStats.chars} chars)
          </div> */}
          <div className="bg-gray-200 text-lg font-bold py-2 px-4 rounded-t-md flex justify-between">
            <span>After</span>
            <span className="text-sm font-medium text-right text-gray-600">
              {newStats.words} words / {newStats.chars} chars
            </span>
          </div>
          <textarea
            ref={textareaBRef}
            className="resize-none w-full p-4 border border-t-0 rounded-b-md min-h-[320px]"
            placeholder="문서 B 입력"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
          />
        </div>
      </div>
    </main>
  );
}
