'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

// --- Web Speech API Types ---
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onstart: () => void;
  onend: () => void;
}
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function SpeechToTextPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setIsSupported(false);
        return;
      }
  
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
  
      recognition.onstart = () => {
        setIsListening(true);
      };
  
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const currentTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);
      };
  
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === 'aborted') return;
        setIsListening(false);
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          try {
            recognition.start();
          } catch (e) {
            console.error('Restart error:', e);
          }
        }, 500);
      };
  
      recognition.onend = () => {
        if (isListening) {
          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('Auto-restart error:', e);
            }
          }, 500);
        } else {
          setIsListening(false);
        }
      };
  
      recognitionRef.current = recognition;
    }
  
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      setIsListening(false);
    };
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const handleCopy = () => {
    if (!transcript.trim()) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (isListening) {
      recognitionRef.current?.stop(); // 강제 재시작
      setTimeout(() => {
        recognitionRef.current?.start();
      }, 300);
    }
  };

  if (!isSupported) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Speech Recognition</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          This browser does not support speech recognition. Please use Chrome.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Speech to Text</h1>

      <div className="mb-4 flex flex-wrap gap-3 items-center">
        <button
          onClick={toggleListening}
          className={`text-sm px-3 py-1 rounded font-bold flex items-center gap-2 transition ${
            isListening ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isListening ? '🎙️ Stop Voice Typing' : '🎤 Start Voice Typing'}
        </button>

        <button
          onClick={handleCopy}
          disabled={!transcript.trim()}
          className={`text-sm px-3 py-1 rounded flex items-center gap-2 transition ${
            transcript.trim()
              ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
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

        <select
          value={language}
          onChange={handleLanguageChange}
          className="text-sm px-2 py-1 border rounded bg-white"
        >
          <option value="de-DE">German</option>
          <option value="en-US">English</option>
          <option value="ko-KR">Korean</option>
        </select>
      </div>

      {isListening && (
        <div className="mt-4 text-sm text-gray-600">
          <p>🎧 Listening... Please speak clearly into the microphone.</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Transcribed Text</h2>
        <div className="p-4 bg-gray-100 rounded min-h-[200px] whitespace-pre-wrap">
          {transcript || 'Start speaking to see the transcription...'}
        </div>
      </div>
    </div>
  );
}