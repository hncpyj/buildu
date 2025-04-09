"use client";

import { useState, useEffect, useRef } from "react";
import { getDiffHtml } from "@/utils/textDiff";

export default function Compare() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [highlighted, setHighlighted] = useState<string | null>(null);

  const [oldStats, setOldStats] = useState({ words: 0, chars: 0 });
  const [newStats, setNewStats] = useState({ words: 0, chars: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");

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

  useEffect(() => {
    if (!oldText.trim() || !newText.trim()) {
      setHighlighted(null);
      return;
    }
    const result = getDiffHtml(oldText, newText);
    setHighlighted(result);
  }, [oldText, newText]);

  const handleReplace = () => {
    if (!searchTerm.trim()) return;
  
    const replaced = newText.replaceAll(searchTerm, replaceTerm);
    setNewText(replaced);
  };

  function highlightSearchTerm(html: string, term: string, replace: string): string {
    if (!term && !replace) return html;
  
    let result = html;
  
    if (term) {
      const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const termRegex = new RegExp(`(${escapedTerm})`, "gi");
      result = result.replace(termRegex, `<span class='bg-green-200 px-1'>$1</span>`);
    }
  
    if (replace) {
      const escapedReplace = replace.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const replaceRegex = new RegExp(`(${escapedReplace})`, "gi");
      result = result.replace(replaceRegex, `<span class='bg-pink-200 px-1'>$1</span>`);
    }
  
    return result;
  }

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Text Comparison</h1>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="search term"
          className="border px-4 py-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="replace term"
          className="border px-4 py-2 rounded"
          value={replaceTerm}
          onChange={(e) => setReplaceTerm(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleReplace}
        >
          Replace
        </button>
      </div>

      

      {/* 💡 박스들을 가로 정렬 */}
      <div className="flex flex-row gap-4 w-full max-w-8xl mb-6">
        {/* 문서 A */}
        <div className="flex flex-col w-full">
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
          <div className="bg-gray-200 text-lg font-bold py-2 px-4 rounded-t-md text-center">
            Changes
          </div>
          <div
            ref={highlightRef}
            className="resize-none w-full p-4 border border-t-0 rounded-b-md mb-4 bg-gray-50 overflow-y-auto whitespace-pre-wrap min-h-[320px]"
            contentEditable={false}
            dangerouslySetInnerHTML={{
              __html: highlightSearchTerm(highlighted || oldText, searchTerm, replaceTerm),
            }}
          />
        </div>

        {/* 문서 B */}
        <div className="flex flex-col w-full">
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
