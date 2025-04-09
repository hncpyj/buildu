"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { Copy, Check } from "lucide-react"; // 이게 아이콘 컴포넌트!


export default function HumanizerPage() {
  const [inputText, setInputText] = useState("");
  const [level, setLevel] = useState<"safe" | "aggressive">("safe");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const syncHeight = () => {
    const inputHeight = inputRef.current?.scrollHeight || 0;
    const outputHeight = outputRef.current?.scrollHeight || 0;
    const maxHeight = Math.max(inputHeight, outputHeight);

    if (inputRef.current) inputRef.current.style.height = `${maxHeight}px`;
    if (outputRef.current) outputRef.current.style.height = `${maxHeight}px`;
  };

  useEffect(() => {
    syncHeight();
  }, [inputText, output]);

  const handleRewrite = async () => {
    if (!inputText.trim()) return alert("Please enter some text.");
    setLoading(true);
    try {
      const res = await fetch("/api/humanizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputText, level }),
      });
      const data = await res.json();
      setOutput(data.rewrittenText || "No result returned.");
    } catch (e) {
      console.error(e);
      setOutput("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const countStats = (text: string) => ({
    words: text.trim().split(/\s+/).filter(Boolean).length,
    chars: text.length,
  });

  const handleCopy = () => {
    if (!output.trim()) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };


  const inputStats = countStats(inputText);
  const outputStats = countStats(output);

  return (
    <>
      {/* ✅ Font Awesome CDN 추가 */}
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTTXRNbC+X8dy+X5RC1Is9EfaS0kRQljEfGqK3p5j3yGq4PVcsZT9MZ5xJrQ7yCBqj4c3zhKFg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>

      <main className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold mb-6">✍️ Humanizer</h1>
        <h2 className="text-2xl font-semibold mb-2">Rewrite to Bypass AI Detection</h2>
        <p className="text-gray-600 mb-4 text-center">
          Turn AI-sounding text into something more natural and human-like.
        </p>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="flex flex-col h-full">
            <label className="text-lg font-semibold mb-1">Input</label>
            <textarea
              ref={inputRef}
              className="w-full p-4 border rounded resize-none overflow-y-auto min-h-[300px]"
              placeholder="Paste AI-looking text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              {inputStats.words} words / {inputStats.chars} chars
            </p>
          </div>

          {/* Output */}
          <div className="flex flex-col h-full">
            {/* 라벨과 버튼을 나란히 정렬 */}
            <div className="flex justify-between items-center mb-1">
              <label className="text-lg font-semibold">Humanized Output</label>
              <button
                onClick={handleCopy}
                className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={16} strokeWidth={2} /> <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} strokeWidth={2} /> <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              ref={outputRef}
              className="w-full p-4 border rounded resize-none overflow-y-auto bg-gray-100 min-h-[300px]"
              value={output}
              readOnly
              placeholder="The rewritten, human-like text will appear here."
            />
            <p className="text-sm text-gray-500 mt-1">
              {outputStats.words} words / {outputStats.chars} chars
            </p>
          </div>

        </div>

        {/* Tone & Button */}
        <div className="flex justify-between items-center w-full max-w-6xl mt-4">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium">Tone:</span>
            <select
              className="border rounded px-2 py-1"
              value={level}
              onChange={(e) => setLevel(e.target.value as "safe" | "aggressive")}
            >
              <option value="safe">Safe</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </label>

          <button
            onClick={handleRewrite}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Rewriting..." : "Humanize it!"}
          </button>
        </div>
      </main>
    </>
  );
}