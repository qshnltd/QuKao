"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Send, BookOpen, RefreshCw, CheckCircle2, ChevronRight, BrainCircuit, ArrowLeft } from "lucide-react";

interface Flashcard {
  id: string;
  subject: string;
  question: string;
  answer: string;
  bg: string;
  textColor: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: "fc1",
    subject: "MATEMATIKA",
    question: "Apa itu Persamaan Kuadrat Kembar dan syarat determinannya?",
    answer: "Persamaan Kuadrat Kembar adalah persamaan yang memiliki dua akar real yang bernilai sama (kembar). Syarat utamanya adalah nilai Diskriminannya sama dengan nol (D = b² - 4ac = 0).",
    bg: "bg-[#D3E4FF]",
    textColor: "text-[#001D35]"
  },
  {
    id: "fc2",
    subject: "FISIKA",
    question: "Apa syarat terjadinya Gerak Melingkar Beraturan (GMB)?",
    answer: "Kecepatan sudut (lintasan sudut per detik) konstan, memiliki percepatan sentripetal yang selalu mengarah ke pusat lingkaran, dan kelajuan linear yang konstan meskipun arah kecepatan linearnya berubah.",
    bg: "bg-[#FFDAD6]",
    textColor: "text-[#410002]"
  },
  {
    id: "fc3",
    subject: "BIOLOGI",
    question: "Apa perbedaan basa nitrogen purin dan pirimidin pada DNA?",
    answer: "Purin terdiri dari Adenin (A) dan Guanin (G) dengan struktur cincin ganda. Pirimidin terdiri dari Sitosin (C) dan Timin (T) dengan struktur cincin tunggal. Pasangannya selalu Purin-Pirimidin (A-T dan G-C).",
    bg: "bg-[#C0EFEF]",
    textColor: "text-[#002020]"
  }
];

export default function StudentLearn() {
  // Flashcard States
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCount, setKnownCount] = useState(0);

  // AI Tutor States
  const [chatPrompt, setChatPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeCard = FLASHCARDS[currentCardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % FLASHCARDS.length);
    }, 150);
  };

  const handleKnown = (known: boolean) => {
    if (known) {
      setKnownCount((prev) => prev + 1);
    }
    handleNextCard();
  };

  const handleQueryAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim() || isAiLoading) return;

    setIsAiLoading(true);
    setErrorMessage(null);
    setAiResponse(null);

    try {
      const payload = {
        messages: [{ role: "user", content: chatPrompt }],
        category: "tutor",
        systemPrompt: "You are QuKao Smart AI, a helpful and engaging high school study companion. Explain academic concepts patiently in professional yet friendly Indonesian. Always use clean paragraphs and markdown formatted sections.",
      };
      
      const safePayload = JSON.stringify(payload, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (value instanceof Event || value instanceof Node || (value.constructor && value.constructor.name === 'SyntheticBaseEvent')) {
             return '[Event/Node omitted]'; // prevent cycle
          }
        }
        return value;
      });

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: safePayload,
      });

      let data;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.error("Failed to parse JSON response:", jsonErr);
        if (!response.ok) {
          throw new Error(`Sistem AI sedang sibuk atau timeout (HTTP ${response.status}). Silakan coba lagi nanti.`);
        }
        throw new Error("Invalid response format dari server (bukan JSON).");
      }

      if (response.ok) {
        if (data.success === false) {
          setErrorMessage(data.error || "Sistem AI sedang sibuk. Silakan coba lagi nanti.");
        } else {
          setAiResponse(data.content);
        }
      } else {
        setErrorMessage(data.error || "Gagal mendapatkan respon dari AI.");
      }
    } catch (err: any) {
      console.error("AI Request Failed:", err);
      setErrorMessage(err.message || "Terjadi kesalahan koneksi internet.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 pt-4 pb-20">
      {/* Grid: Left - Flashcards, Right - AI Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Flashcard Section */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-outfit text-[#1B1B1F] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#005AC1]" /> Flashcard Terpadu
            </h3>
            <span className="text-xs font-bold uppercase tracking-widest text-[#44474E] px-3 py-1 bg-[#E1E2EC] rounded-full">
              Paham: {knownCount} Card
            </span>
          </div>

          {/* Flashcard Container */}
          <div className="relative min-h-[340px] w-full perspective-1000">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full min-h-[300px] p-8 rounded-[40px] cursor-pointer  border border-[#E1E2EC] flex flex-col justify-between transition-all duration-300 relative transform-style-3d ${
                  isFlipped ? "bg-[#1B1B1F] text-white" : `${activeCard.bg} ${activeCard.textColor}`
                }`}
              >
                {/* Header of Card */}
                <div className="flex justify-between items-center">
                  <span className={`text-[11px] font-black tracking-widest px-3 py-1.5 rounded-full ${isFlipped ? "bg-white/10 text-white" : "bg-black/5"}`}>
                    {activeCard.subject}
                  </span>
                  <span className="text-xs font-medium opacity-60">
                    Sisi: {isFlipped ? "Jawaban" : "Pertanyaan"}
                  </span>
                </div>

                {/* Question / Answer Text */}
                <div className="py-6 select-none">
                  {isFlipped ? (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-white/50 font-bold">Penjelasan:</p>
                      <p className="text-lg md:text-xl font-medium leading-relaxed font-outfit">{activeCard.answer}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider opacity-50 font-bold">Kenali Istilah:</p>
                      <p className="text-xl md:text-2xl font-black leading-snug font-outfit">{activeCard.question}</p>
                    </div>
                  )}
                </div>

                {/* Footer of Card */}
                <div className="flex justify-between items-center text-xs opacity-75">
                  <span>Klik kartu untuk membalik</span>
                  <RefreshCw className="w-4 h-4 animate-spin-slow" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => handleKnown(false)}
              className="flex-1 py-4 px-6 rounded-[24px] bg-[#E1E2EC] hover:bg-[#D4D6E0] text-[#1B1B1F] text-sm font-bold transition-all active:scale-95 border border-transparent"
            >
              Pelajari Lagi
            </button>
            <button
              onClick={() => handleKnown(true)}
              className="flex-1 py-4 px-6 rounded-[24px] bg-[#005AC1] hover:bg-[#004A9E] text-white text-sm font-bold transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Saya Paham
            </button>
          </div>
        </div>

        {/* AI Smart Tutor Companion */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-outfit text-[#1B1B1F] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#005AC1]" /> Tutor Pintar AI
            </h3>
            <p className="text-xs text-[#44474E] font-medium leading-relaxed">
              Tanyakan apa saja! Rumus fisika, ringkasan biologi, langkah pembuktian matematika, atau tips persiapan ujian.
            </p>
          </div>

          <div className="border border-[#E1E2EC] rounded-[32px] overflow-hidden flex flex-col min-h-[420px] bg-white">
            {/* Answer Display */}
            <div className="flex-1 p-6 overflow-y-auto max-h-[340px] space-y-4">
              {aiResponse ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#005AC1] uppercase tracking-wider">
                    <BrainCircuit className="w-4 h-4" /> QuKao AI Companion
                  </div>
                  <div className="text-sm text-[#1B1B1F] leading-relaxed select-text space-y-3 prose max-w-none">
                    {aiResponse.split("\n\n").map((para, i) => (
                      <p key={i} className="whitespace-pre-line font-medium text-slate-800">{para}</p>
                    ))}
                  </div>
                </div>
              ) : errorMessage ? (
                <div className="p-4 rounded-2xl bg-[#FFDAD6] border border-[#FFB4AB] text-[#410002] text-sm font-medium">
                  {errorMessage}
                </div>
              ) : isAiLoading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                  <div className="w-8 h-8 rounded-full border-4 border-[#005AC1] border-t-transparent animate-spin"></div>
                  <p className="text-xs font-bold text-[#44474E] animate-pulse">Menghubungi AI Smart Tutor...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-[#44474E] px-6">
                  <BrainCircuit className="w-12 h-12 text-[#9A9EB0] mb-3 animate-pulse" />
                  <p className="text-sm font-bold">Ketik pertanyaanmu di kolom bawah</p>
                  <p className="text-xs mt-1 text-slate-400">Contoh: &quot;Jelaskan materi Mitosis dan Meiosis dengan perbedaannya&quot;</p>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleQueryAi} className="p-4 border-t border-[#E1E2EC] bg-[#F3F4F9] flex gap-2 items-center">
               <div className="flex gap-2 overflow-x-auto pb-1 mr-2 hidden md:flex">
                 {["Cara kerja DNS?", "Rumus Gaya Sentripetal", "Hukum Newton 3"].map(suggestion => (
                    <button 
                       key={suggestion} 
                       type="button" 
                       onClick={() => setChatPrompt(suggestion)}
                       className="whitespace-nowrap px-3 py-1.5 bg-[#E1E2EC] hover:bg-[#D4D6E0] rounded-full text-xs font-bold text-[#1B1B1F] transition-colors"
                    >
                       {suggestion}
                    </button>
                 ))}
               </div>
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Tanyakan konsep belajar baru..."
                className="flex-1 bg-white border border-[#C4C6D0] rounded-[24px] px-5 py-3.5 text-sm font-medium outline-none text-[#1B1B1F] placeholder-[#44474E] focus:border-[#005AC1] focus:ring-1 focus:ring-[#005AC1] transition-all"
                disabled={isAiLoading}
              />
              <button
                type="submit"
                disabled={isAiLoading || !chatPrompt.trim()}
                className="w-12 h-12 rounded-full bg-[#005AC1] hover:bg-[#004A9E] text-white flex items-center justify-center transition-all disabled:bg-[#E1E2EC] disabled:text-[#9A9EB0] active:scale-95 shrink-0 "
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
