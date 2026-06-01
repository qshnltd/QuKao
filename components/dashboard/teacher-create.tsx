"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { PlusCircle, Trash2, ArrowRight, GraduationCap, Zap, FileText, Check, AlertCircle, Menu, X, Settings2, ShieldCheck, Send, LayoutTemplate, HelpCircle, UploadCloud } from "lucide-react";
import { ClassItem, Question, QuizItem } from "./types";

interface TeacherCreateProps {
  classes: ClassItem[];
  setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  onSuccess: (tabName: string) => void;
}

export default function TeacherCreate({ classes, setClasses, onSuccess }: TeacherCreateProps) {
  const [selectedMode, setSelectedMode] = useState<"ujian" | "quiz" | "form" | null>(null);
  const [activeSection, setActiveSection] = useState<"ai_generate" | "detail" | "pertanyaan" | "keamanan" | "publikasi">("detail");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiGenerateStatus, setAiGenerateStatus] = useState("");
  const [aiProgress, setAiProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [randomizeOptions, setRandomizeOptions] = useState(false);
  const [preventTabSwitch, setPreventTabSwitch] = useState(true);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [duration, setDuration] = useState("15 Menit");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "q-1", text: "", type: "pilihan_ganda", options: ["", "", "", ""], correctAnswer: "A" }
  ]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Advanced & Gamification
  const [questionTimer, setQuestionTimer] = useState(true);
  const [allowAfterTime, setAllowAfterTime] = useState(false);
  const [anonymizeNames, setAnonymizeNames] = useState(false);
  const [skipAndAttemptLater, setSkipAndAttemptLater] = useState(true);
  
  const [attempts, setAttempts] = useState("1");
  const [redemptionQuestion, setRedemptionQuestion] = useState(false);
  const [showAnswerAfter, setShowAnswerAfter] = useState("validate_only");
  
  const [disableRightClick, setDisableRightClick] = useState(true);
  const [disableCopyPaste, setDisableCopyPaste] = useState(true);
  const [showAllAfterSession, setShowAllAfterSession] = useState("on");
  
  const [gamification, setGamification] = useState({
      seriousTheme: false,
      leaderboard: true,
      powerUps: true,
      liveReactions: true,
      playMusic: true,
      stretchAndShield: true,
      showMeme: false
  });
  
  // Chatbot state
  const [aiChatInput, setAiChatInput] = useState("");
  const [aiChatMessages, setAiChatMessages] = useState<{role: 'ai'|'user', text: string}[]>([{ role: 'ai', text: 'Halo! Saya QuKao AI. Anda ingin membuat kuis, form, atau ujian tentang apa hari ini? Kirimkan materi referensi atau ketik deskripsi di bawah.'}]);

  const handleAiSendMessage = (e: React.FormEvent) => {
      e.preventDefault();
      if (!aiChatInput.trim()) return;
      setAiChatMessages(prev => [...prev, { role: 'user', text: aiChatInput }]);
      setAiChatInput("");
      
      setTimeout(() => {
          setAiChatMessages(prev => [...prev, { role: 'ai', text: 'Baik, saya sedang menyusun pengaturan dan pertanyaan berdasarkan permintaan Anda...' }]);
          handleAiGenerateSequence(new File([""], "chatbot_input.txt"));
      }, 1000);
  };

  const handleAiGenerateSequence = async (file: File) => {
      // Validate file size
      // (Bisa juga ditambahkan validasi untuk verified / unverified)
      const MAX_SIZE = 20 * 1024 * 1024; // 20MB for verified, for simplicity.
      if (file.size > MAX_SIZE) {
          setFeedback("Ukuran file terlalu besar! Maksimal 20MB.");
          return;
      }
      setFeedback(null);
      setIsAiGenerating(true);
      setAiProgress(5);
      setAiGenerateStatus("Memulai analisis materi...");
      
      // Fake processing delay to simulate reading
      await new Promise(r => setTimeout(r, 2000));
      
      setAiProgress(20);
      setAiGenerateStatus("Mengonfigurasi Pengaturan Umum...");
      setActiveSection("detail");
      setTitle("Evaluasi AI: " + file.name.split('.')[0]);
      if (classes.length > 0) {
          setSelectedClassId(classes[0].id);
      }
      setDuration("45 Menit");
      
      await new Promise(r => setTimeout(r, 3000));
      
      setAiProgress(40);
      setAiGenerateStatus("Menyusun Daftar Pertanyaan...");
      setActiveSection("pertanyaan");
      
      setQuestions([]);
      await new Promise(r => setTimeout(r, 1000));
      
      // Question 1
      setQuestions([
        { id: `q-${Date.now()}-1`, text: "Berdasarkan materi yang dilampirkan, apa poin utama yang disampaikan di dalamnya?", type: "pilihan_ganda", options: ["Teori Dasar", "Aplikasi Praktis", "Studi Kasus", "Semua Benar"], correctAnswer: "D" }
      ]);
      await new Promise(r => setTimeout(r, 2000));
      
      // Question 2
      setQuestions(prev => [
        ...prev,
        { id: `q-${Date.now()}-2`, text: "Jelaskan dengan ringkas analisis Anda terkait topik di atas berdasarkan dokumen.", type: "esai" }
      ]);
      await new Promise(r => setTimeout(r, 2500));
      
      setAiProgress(75);
      setAiGenerateStatus("Menyiapkan Keamanan Akses...");
      setActiveSection("keamanan");
      setRandomizeQuestions(true);
      setRandomizeOptions(true);
      setPreventTabSwitch(true);
      
      await new Promise(r => setTimeout(r, 2500));
      
      setAiProgress(100);
      setAiGenerateStatus("Menyelesaikan konfigurasi...");
      setActiveSection("publikasi");
      setIsAiGenerating(false);
  };

  const handleAddQuestion = () => {
    const newId = `q-${Date.now()}`;
    setQuestions(prev => [
      ...prev,
      { id: newId, text: "", type: "pilihan_ganda", options: ["", "", "", ""], correctAnswer: "A" }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (index: number, text: string) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, text } : q));
  };

  const handleQuestionTypeChange = (index: number, type: "pilihan_ganda" | "esai") => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === index) {
        return {
          ...q,
          type,
          options: type === "pilihan_ganda" ? ["", "", "", ""] : undefined,
          correctAnswer: type === "pilihan_ganda" ? "A" : undefined
        };
      }
      return q;
    }));
  };

  const handleOptionChange = (qIndex: number, optIndex: number, val: string) => {
    setQuestions(prev => prev.map((q, i) => {
      if (i === qIndex && q.options) {
        const nextOpts = [...q.options];
        nextOpts[optIndex] = val;
        return { ...q, options: nextOpts };
      }
      return q;
    }));
  };

  const handleCorrectAnswerChange = (qIndex: number, val: string) => {
    setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, correctAnswer: val } : q));
  };

  const handleSaveEvaluation = (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault();
    if (!title.trim() || !selectedClassId) {
      setFeedback("Mohon lengkapi judul evaluasi dan pilih kelas!");
      return;
    }

    // Validate that questions have content
    const invalidQuestion = questions.some(q => !q.text.trim());
    if (invalidQuestion) {
      setFeedback("Mohon isi semua teks pertanyaan!");
      return;
    }

    const newQuiz: QuizItem = {
      id: `quiz-${Date.now()}`,
      title,
      questions,
      duration,
      done: false,
      score: null,
      type: selectedMode || "quiz",
      isDraft: asDraft
    };

    // Update parent classes state
    setClasses(prev => prev.map(cls => {
      if (cls.id === selectedClassId) {
        return {
          ...cls,
          quizzes: [newQuiz, ...cls.quizzes]
        };
      }
      return cls;
    }));

    setFeedback(null);
    setTitle("");
    setQuestions([{ id: "q-1", text: "", type: "pilihan_ganda", options: ["", "", "", ""], correctAnswer: "A" }]);
    setSelectedMode(null);

    // Prompt user with real success
    if (asDraft) {
      alert(`Evaluasi "${title}" disimpan sebagai draf!`);
    } else {
      alert(`Evaluasi "${title}" berhasil disimpan & dirilis ke kelas!`);
    }
    
    onSuccess("classes");
  };

  if (!selectedMode) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 py-8 px-6 lg:px-10">
        <div>
           <h2 className="text-xl font-bold font-outfit text-[#1B1B1F]">Pilih Mode Pembuatan</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
          {/* Ujian Mode Card */}
          <div 
            onClick={() => setSelectedMode("ujian")}
            className="bg-[#D3E4FF] p-8 rounded-[40px] flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden group min-h-[220px]"
          >
            <div className="w-16 h-16 bg-[#005AC1] rounded-[24px] flex items-center justify-center text-white mb-8">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-outfit font-black text-[#001D35] mb-2 leading-tight">Ujian Mode</h3>
              <p className="text-[#001D35] opacity-80 font-medium">Ujian serius, pilihan ganda & esai terpadu.</p>
            </div>
            <ArrowRight className="absolute right-8 bottom-8 w-8 h-8 text-[#005AC1] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
          </div>

          {/* Quiz Mode Card */}
          <div 
            onClick={() => setSelectedMode("quiz")}
            className="bg-[#FFDF92] p-8 rounded-[40px] flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden group min-h-[220px]"
          >
            <div className="w-16 h-16 bg-[#785900] rounded-[24px] flex items-center justify-center text-white mb-8">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-outfit font-black text-[#261A00] mb-2 leading-tight">Quiz Mode</h3>
              <p className="text-[#261A00] opacity-80 font-medium">Kuis harian interaktif untuk melatih pemahaman.</p>
            </div>
            <ArrowRight className="absolute right-8 bottom-8 w-8 h-8 text-[#785900] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
          </div>

          {/* Form Mode Card */}
          <div 
            onClick={() => setSelectedMode("form")}
            className="bg-[#E1E2EC] p-8 rounded-[40px] flex flex-col justify-between hover:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden group min-h-[220px]"
          >
            <div className="w-16 h-16 bg-[#44474E] rounded-[24px] flex items-center justify-center text-white mb-8">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-3xl font-outfit font-black text-[#1B1B1F] mb-2 leading-tight">Form Mode</h3>
              <p className="text-[#1B1B1F] opacity-80 font-medium font-outfit">Lembar serves umpan balik & pertanyaan terbuka.</p>
            </div>
            <ArrowRight className="absolute right-8 bottom-8 w-8 h-8 text-[#44474E] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-[100] bg-[#F8F9FF] flex overflow-hidden">
      {/* OVERLAY FOR MOBILE */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 z-[101] lg:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR NAVIGATION RAIL */}
      <div className={`fixed inset-y-0 left-0 w-[280px] bg-white border-r border-[#E1E2EC] flex flex-col p-6 z-[102] transition-transform duration-300 lg:translate-x-0 absolute lg:relative h-full shrink-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between mb-8 lg:hidden">
            <h1 className="font-outfit text-4xl font-black tracking-tighter text-[#005AC1] select-none">
              Qu<span className="text-[#001D35]">Kao</span>
            </h1>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-10 h-10 rounded-full bg-[#F3F4F9] flex items-center justify-center">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="hidden lg:flex items-center justify-between mb-8 py-6">
            <h1 className="font-outfit text-3xl font-black tracking-tighter text-[#005AC1] select-none">
              Qu<span className="text-[#001D35]">Kao</span> <span className="text-[#44474E] text-base font-medium ml-2">Editor</span>
            </h1>
        </div>

        <div className="hidden lg:block mb-6">
            <span className="text-xs uppercase font-black px-4 py-2 bg-[#D3E4FF] rounded-full text-[#001D35]">
                 Buat {selectedMode === "ujian" ? "Ujian" : selectedMode === "quiz" ? "Kuis" : "Form"}
            </span>
        </div>

        <div className="flex flex-col gap-2">
            <button type="button" onClick={() => { setActiveSection("ai_generate"); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors font-bold ${activeSection === "ai_generate" ? "bg-[#FFDAD6] text-[#410002]" : "text-[#BA1A1A] hover:bg-[#FFDAD6]/50"}`}>
                <Zap className="w-5 h-5" /> AI Generate
            </button>
            <button type="button" onClick={() => { setActiveSection("detail"); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors font-bold ${activeSection === "detail" ? "bg-[#D3E4FF] text-[#001D35]" : "text-[#44474E] hover:bg-[#E1E2EC]/50"}`}>
                <Settings2 className="w-5 h-5" /> Pengaturan Umum
            </button>
            <button type="button" onClick={() => { setActiveSection("pertanyaan"); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors font-bold ${activeSection === "pertanyaan" ? "bg-[#D3E4FF] text-[#001D35]" : "text-[#44474E] hover:bg-[#E1E2EC]/50"}`}>
                <HelpCircle className="w-5 h-5" /> Daftar Pertanyaan
            </button>
            <button type="button" onClick={() => { setActiveSection("keamanan"); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors font-bold ${activeSection === "keamanan" ? "bg-[#D3E4FF] text-[#001D35]" : "text-[#44474E] hover:bg-[#E1E2EC]/50"}`}>
                <ShieldCheck className="w-5 h-5" /> Keamanan Akses
            </button>
            <button type="button" onClick={() => { setActiveSection("publikasi"); setIsMobileMenuOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-full transition-colors font-bold ${activeSection === "publikasi" ? "bg-[#D3E4FF] text-[#001D35]" : "text-[#44474E] hover:bg-[#E1E2EC]/50"}`}>
                <Send className="w-5 h-5" /> Rilis & Publikasi
            </button>
        </div>

        <div className="mt-auto pt-6 border-t border-[#E1E2EC] lg:border-transparent">
             <button type="button" onClick={() => { setSelectedMode(null); setActiveSection("detail"); }} className="flex items-center justify-center gap-2 text-sm font-bold text-[#44474E] hover:text-[#BA1A1A] hover:bg-[#FFDAD6] px-4 py-3 rounded-full w-full transition-colors">
                Batal & Keluar
             </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 w-full bg-[#F8F9FF] flex flex-col overflow-y-auto px-6 lg:px-10 pb-20 relative">
        
        {/* Mobile App Bar */}
        <div className="lg:hidden flex border-b border-[#E1E2EC] items-center justify-between sticky top-0 z-40 bg-[#F3F4F9]/90 backdrop-blur-xl -mx-6 px-6 pt-4 pb-4 mb-8">
            <div className="flex items-center gap-3">
               <button type="button" onClick={() => setIsMobileMenuOpen(true)} className="w-12 h-12 rounded-full hover:bg-white flex items-center justify-center text-[#1B1B1F]">
                   <Menu className="w-6 h-6" />
               </button>
               <h1 className="font-outfit text-3xl font-black tracking-tighter text-[#005AC1] select-none">
                 Qu<span className="text-[#001D35]">Kao</span> <span className="text-[#44474E] text-sm ml-1">Editor</span>
               </h1>
            </div>
            
            <button onClick={() => setSelectedMode(null)} className="text-xs font-bold px-4 py-2 uppercase bg-white border border-[#E1E2EC] rounded-full text-[#001D35]">
                 Tutup
            </button>
        </div>

      <form onSubmit={(e) => handleSaveEvaluation(e, false)} className="flex flex-col gap-10 mt-8 max-w-4xl mx-auto w-full">
        {feedback && (
          <div className="p-4 rounded-2xl bg-[#FFDAD6] border border-[#FFB4AB] text-[#410002] flex items-center gap-2 text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" /> {feedback}
          </div>
        )}

        {/* SECTION: AI GENERATE */}
        <div className={`flex flex-col gap-6 ${activeSection === "ai_generate" ? "block" : "hidden"}`}>
            <div>
              <h3 className="text-3xl font-outfit font-black text-[#1B1B1F]">AI Generate</h3>
              <p className="text-sm text-[#44474E] mt-1 font-medium">Buat evaluasi otomatis menggunakan bantuan QuKao AI.</p>
            </div>
            
            <div className="flex flex-col mt-2 h-[500px] bg-white border border-[#E1E2EC] rounded-[32px] overflow-hidden shadow-sm relative">
                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {aiChatMessages.map((msg, i) => (
                        <div key={i} className={`flex max-w-[85%] ${msg.role === 'ai' ? 'self-start' : 'self-end'}`}>
                            {msg.role === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-[#BA1A1A] flex items-center justify-center shrink-0 mr-3 mt-1">
                                    <Zap className="w-4 h-4 text-white" />
                                </div>
                            )}
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'ai' ? 'bg-[#F3F4F9] text-[#1B1B1F] rounded-tl-sm' : 'bg-[#005AC1] text-white rounded-tr-sm'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isAiGenerating && (
                         <div className="flex max-w-[85%] self-start">
                             <div className="w-8 h-8 rounded-full bg-[#BA1A1A] flex items-center justify-center shrink-0 mr-3 mt-1">
                                 <Zap className="w-4 h-4 text-white" />
                             </div>
                             <div className="p-4 rounded-2xl bg-[#FFDAD6] text-[#410002] rounded-tl-sm w-full min-w-[250px]">
                                 <div className="flex justify-between items-center text-xs font-bold mb-2">
                                     <span className="flex items-center gap-2">
                                        <div className="w-3 h-3 border-2 border-[#BA1A1A] border-t-transparent rounded-full animate-spin"></div>
                                        {aiGenerateStatus}
                                     </span>
                                     <span>{aiProgress}%</span>
                                 </div>
                                 <div className="w-full bg-[#F3F4F9] h-2 rounded-full overflow-hidden">
                                     <motion.div 
                                         initial={{ width: 0 }}
                                         animate={{ width: `${aiProgress}%` }}
                                         className="h-full bg-[#BA1A1A] rounded-full"
                                         transition={{ ease: "easeInOut", duration: 0.5 }}
                                     />
                                 </div>
                             </div>
                         </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-[#E1E2EC] flex items-end gap-3">
                    <label htmlFor="aiFileUpload" className="p-3 bg-[#F3F4F9] hover:bg-[#E1E2EC] rounded-full cursor-pointer transition-colors text-[#44474E] shrink-0 mb-1">
                        <UploadCloud className="w-5 h-5" />
                        <input 
                          type="file" 
                          id="aiFileUpload" 
                          className="hidden" 
                          onChange={(e) => {
                             if(e.target.files && e.target.files[0]) {
                                setAiChatInput(`Tolong pelajari file ini: ${e.target.files[0].name}`);
                             }
                          }} 
                        />
                    </label>
                    <div className="flex-1 bg-[#F3F4F9] rounded-[24px] border border-transparent focus-within:border-[#005AC1]/30 transition-colors px-4 py-3 flex items-center">
                       <input 
                          type="text" 
                          value={aiChatInput}
                          onChange={(e) => setAiChatInput(e.target.value)}
                          onKeyDown={(e) => { if(e.key === 'Enter') handleAiSendMessage(e) }}
                          placeholder="Ketik topik materi atau lampirkan instruksi pembuatan..."
                          className="w-full bg-transparent outline-none text-sm font-medium text-[#1B1B1F] placeholder:text-[#8D9199]"
                          disabled={isAiGenerating}
                       />
                    </div>
                    <button 
                       onClick={handleAiSendMessage}
                       disabled={!aiChatInput.trim() || isAiGenerating}
                       className="p-3 bg-[#BA1A1A] disabled:bg-[#E1E2EC] text-white disabled:text-[#8D9199] rounded-full hover:bg-[#93000A] transition-colors shrink-0 mb-1"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

        {/* SECTION: DETAIL PENGATURAN UMUM */}
        <div className={`flex flex-col gap-6 ${activeSection === "detail" ? "block" : "hidden"}`}>
            <div>
              <h3 className="text-3xl font-outfit font-black text-[#1B1B1F]">Pengaturan Umum</h3>
              <p className="text-sm text-[#44474E] mt-1 font-medium">Informasi dasar evaluasi yang akan dibuat.</p>
            </div>
            
            <div className="flex flex-col gap-8 mt-2">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#44474E] ml-4">Judul Evaluasi</label>
                    <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Ulangan Harian Biologi"
                    className="w-full bg-white text-xl md:text-2xl font-black text-[#1B1B1F] placeholder:text-[#C4C7C5] outline-none border border-[#E1E2EC] py-5 px-6 rounded-[28px] focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 transition-all"
                    required={activeSection === "detail"}
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#44474E] ml-4">Deskripsi Evaluasi</label>
                    <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan tujuan dan materi yang akan diuji..."
                    className="w-full bg-white text-base text-[#1B1B1F] placeholder:text-[#C4C7C5] outline-none border border-[#E1E2EC] py-4 px-6 rounded-[24px] focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 transition-all resize-none h-24"
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#44474E] ml-4">Alokasi Kelas</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            className="w-full px-6 py-5 bg-white border border-[#E1E2EC] rounded-[28px] text-base font-bold text-[#1B1B1F] focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 outline-none appearance-none cursor-pointer transition-all"
                            required={activeSection === "detail"}
                        >
                            <option value="">-- Pilih Kelas Aktif --</option>
                            {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>{cls.name} ({cls.code})</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#44474E] ml-4">Durasi Pengerjaan</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full px-6 py-5 bg-white border border-[#E1E2EC] rounded-[28px] text-base font-bold text-[#1B1B1F] focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 outline-none appearance-none cursor-pointer transition-all"
                        >
                            <option value="5 Menit">5 Menit</option>
                            <option value="10 Menit">10 Menit</option>
                            <option value="15 Menit">15 Menit</option>
                            <option value="20 Menit">20 Menit</option>
                            <option value="30 Menit">30 Menit</option>
                            <option value="45 Menit">45 Menit</option>
                            <option value="60 Menit">60 Menit</option>
                            <option value="Unlimited">Tanpa Batas</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-[#44474E] ml-4">Maksimal Peserta</label>
                        <input
                           type="number"
                           value={maxParticipants}
                           onChange={(e) => setMaxParticipants(e.target.value)}
                           placeholder="Unlimited"
                           className="w-full bg-white text-base font-bold text-[#1B1B1F] placeholder:text-[#C4C7C5] outline-none border border-[#E1E2EC] py-5 px-6 rounded-[28px] focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 transition-all"
                        />
                    </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                    <button type="button" onClick={() => setActiveSection("pertanyaan")} className="px-8 py-4 bg-[#005AC1] hover:bg-[#004A9E] text-white rounded-full font-bold flex items-center gap-2 transition-colors">
                        Lanjut ke Pertanyaan <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

        {/* SECTION: PERTANYAAN */}
        <div className={`flex flex-col gap-6 ${activeSection === "pertanyaan" ? "block" : "hidden"}`}>
            <div>
                <h3 className="text-3xl font-outfit font-black text-[#1B1B1F]">Daftar Pertanyaan</h3>
                <p className="text-sm text-[#44474E] mt-1 font-medium">Buat dan atur soal untuk evaluasi siswa.</p>
            </div>
            
            <div className="flex flex-col gap-10 mt-2">
                {questions.map((q, qIndex) => (
                <div key={q.id} className="relative bg-white border border-[#E1E2EC] rounded-[36px] p-6 lg:p-10 flex flex-col gap-6 group hover:border-[#005AC1]/30 transition-colors">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-[#F3F4F9] text-[#1B1B1F] font-black text-xl flex items-center justify-center shrink-0">
                                {qIndex + 1}
                            </div>
                            <div className="flex bg-[#F3F4F9] rounded-full items-center p-1 border border-[#E1E2EC]/50">
                                <button
                                type="button"
                                onClick={() => handleQuestionTypeChange(qIndex, "pilihan_ganda")}
                                className={`rounded-full px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all ${
                                    q.type === "pilihan_ganda" ? "bg-white text-[#1B1B1F] shadow-sm cursor-default" : "text-[#44474E] hover:text-[#1B1B1F] cursor-pointer"
                                }`}
                                >
                                Ganda
                                </button>
                                <button
                                type="button"
                                onClick={() => handleQuestionTypeChange(qIndex, "esai")}
                                className={`rounded-full px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all ${
                                    q.type === "esai" ? "bg-white text-[#1B1B1F] shadow-sm cursor-default" : "text-[#44474E] hover:text-[#1B1B1F] cursor-pointer"
                                }`}
                                >
                                Esai
                                </button>
                            </div>
                        </div>
                        
                        {questions.length > 1 && (
                            <button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIndex)}
                            className="w-12 h-12 rounded-full text-[#BA1A1A] hover:bg-[#FFDAD6] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                            >
                                <Trash2 className="w-5 h-5"/>
                            </button>
                        )}
                    </div>

                    <textarea
                        className="w-full bg-[#F3F4F9] rounded-3xl text-xl font-medium text-[#1B1B1F] placeholder:text-[#8D9199] outline-none border border-transparent resize-y focus:border-[#005AC1]/30 focus:ring-4 focus:ring-[#005AC1]/5 p-6 leading-relaxed transition-all min-h-[120px]"
                        rows={2}
                        value={q.text}
                        onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
                        placeholder="Tuliskan pertanyaan di sini..."
                        required={activeSection === "pertanyaan"}
                    />

                    {q.type === 'pilihan_ganda' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            {["A", "B", "C", "D"].map((opt, optIndex) => (
                                <div
                                    key={opt}
                                    className={`p-2 pr-4 rounded-[24px] border ${q.correctAnswer === opt ? 'border-[#005AC1] bg-[#D3E4FF]/30' : 'border-[#E1E2EC] bg-[#F3F4F9]'} flex items-center gap-4 transition-colors focus-within:border-[#005AC1] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#005AC1]/10`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleCorrectAnswerChange(qIndex, opt)}
                                        className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shrink-0 transition-all cursor-pointer ${q.correctAnswer === opt ? 'bg-[#005AC1] text-white' : 'bg-white shadow-sm text-[#44474E] hover:bg-[#E1E2EC]'}`}
                                    >
                                        {opt}
                                    </button>
                                    <input
                                        type="text"
                                        value={q.options?.[optIndex] || ""}
                                        onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none font-bold text-base text-[#1B1B1F] min-w-0 placeholder:font-medium placeholder:text-[#8D9199]"
                                        placeholder={`Jawaban ${opt}`}
                                        required={activeSection === "pertanyaan" && q.type === "pilihan_ganda"}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-8 mt-2 rounded-[36px] border-[3px] border-dashed border-[#E1E2EC] text-[#44474E] hover:border-[#005AC1] hover:text-[#005AC1] hover:bg-[#D3E4FF]/30 transition-all font-bold flex items-center justify-center gap-3 text-lg cursor-pointer bg-white"
            >
                <PlusCircle className="w-6 h-6" /> Tambah Soal Baru
            </button>
            <div className="mt-8 flex justify-end">
                <button type="button" onClick={() => setActiveSection("keamanan")} className="px-8 py-4 bg-[#005AC1] hover:bg-[#004A9E] text-white rounded-full font-bold flex items-center gap-2 transition-colors">
                    Lanjut ke Keamanan <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* SECTION: KEAMANAN & LANJUTAN */}
        <div className={`flex flex-col gap-8 ${activeSection === "keamanan" ? "block" : "hidden"}`}>
            <div>
               <h3 className="text-3xl font-outfit font-black text-[#1B1B1F]">Pengaturan Lanjutan & Keamanan</h3>
               <p className="text-sm text-[#44474E] mt-1 font-medium">Bantu mitigasi kecurangan, atur gamifikasi, dan batasi sesi jawaban.</p>
            </div>
            
            <div className="flex flex-col gap-6">
                 {/* GENERAL ADVANCED */}
                 <div className="bg-white p-6 rounded-[28px] border border-[#E1E2EC] flex flex-col gap-4">
                     <h4 className="font-bold text-[#1B1B1F] text-lg mb-2">Umum & Penguasaan</h4>
                     <div className="flex items-center justify-between">
                         <span className="font-medium text-[#44474E]">Sembunyikan Nama Asli (Anonim)</span>
                         <button type="button" onClick={() => setAnonymizeNames(!anonymizeNames)} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${anonymizeNames ? "bg-[#005AC1]" : "bg-[#E1E2EC]"}`}>
                             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${anonymizeNames ? "translate-x-7" : "translate-x-1"}`} />
                         </button>
                     </div>
                     <div className="flex items-center justify-between">
                         <span className="font-medium text-[#44474E]">Izinkan Lewati Soal & Jawab Nanti</span>
                         <button type="button" onClick={() => setSkipAndAttemptLater(!skipAndAttemptLater)} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${skipAndAttemptLater ? "bg-[#005AC1]" : "bg-[#E1E2EC]"}`}>
                             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${skipAndAttemptLater ? "translate-x-7" : "translate-x-1"}`} />
                         </button>
                     </div>
                     <div className="flex items-center justify-between">
                         <span className="font-medium text-[#44474E]">Aktifkan Penebusan Kesalahan Soal</span>
                         <button type="button" onClick={() => setRedemptionQuestion(!redemptionQuestion)} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${redemptionQuestion ? "bg-[#005AC1]" : "bg-[#E1E2EC]"}`}>
                             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${redemptionQuestion ? "translate-x-7" : "translate-x-1"}`} />
                         </button>
                     </div>
                     <div className="flex items-center justify-between mt-2">
                         <span className="font-medium text-[#44474E]">Batas Percobaan Pengerjaan</span>
                         <select value={attempts} onChange={(e) => setAttempts(e.target.value)} className="bg-[#F3F4F9] border border-[#E1E2EC] rounded-lg px-4 py-2 outline-none font-bold text-sm">
                             <option value="1">1 Kali</option>
                             <option value="2">2 Kali</option>
                             <option value="4">4 Kali</option>
                             <option value="unlimited">Tanpa Batas</option>
                         </select>
                     </div>
                     <div className="flex items-center justify-between mt-2">
                         <span className="font-medium text-[#44474E]">Tampilkan Jawaban Setelah Menjawab</span>
                         <select value={showAnswerAfter} onChange={(e) => setShowAnswerAfter(e.target.value)} className="bg-[#F3F4F9] border border-[#E1E2EC] rounded-lg px-4 py-2 outline-none font-bold text-sm">
                             <option value="on">Aktif (Tampil Detail)</option>
                             <option value="validate_only">Validasi Saja (Benar/Salah)</option>
                             <option value="off">Mati</option>
                         </select>
                     </div>
                 </div>

                 {/* ANTI CHEATING */}
                 <div className="bg-[#FFF8F6] p-6 rounded-[28px] border border-[#FFDAD6] flex flex-col gap-4">
                     <h4 className="font-bold text-[#410002] text-lg mb-2">Anti Kecurangan</h4>
                     <div className="flex items-center justify-between">
                         <span className="font-medium text-[#410002]">Acak Urutan Soal & Pilihan Ganda</span>
                         <button type="button" onClick={() => { setRandomizeQuestions(!randomizeQuestions); setRandomizeOptions(!randomizeQuestions); }} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${randomizeQuestions ? "bg-[#BA1A1A]" : "bg-[#E1E2EC]"}`}>
                             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${randomizeQuestions ? "translate-x-7" : "translate-x-1"}`} />
                         </button>
                     </div>
                     <div className="flex items-center justify-between">
                         <span className="font-medium text-[#410002]">Proteksi Tab Peramban (Track Pindah Layar)</span>
                         <button type="button" onClick={() => setPreventTabSwitch(!preventTabSwitch)} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${preventTabSwitch ? "bg-[#BA1A1A]" : "bg-[#E1E2EC]"}`}>
                             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${preventTabSwitch ? "translate-x-7" : "translate-x-1"}`} />
                         </button>
                     </div>
                     <div className="flex items-center justify-between">
                         <span className="font-medium text-[#410002]">Nonaktifkan Klik Kanan (Mencegah Pencarian)</span>
                         <button type="button" onClick={() => setDisableRightClick(!disableRightClick)} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${disableRightClick ? "bg-[#BA1A1A]" : "bg-[#E1E2EC]"}`}>
                             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${disableRightClick ? "translate-x-7" : "translate-x-1"}`} />
                         </button>
                     </div>
                     <div className="flex items-center justify-between">
                         <span className="font-medium text-[#410002]">Nonaktifkan Copy & Paste Teks</span>
                         <button type="button" onClick={() => setDisableCopyPaste(!disableCopyPaste)} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${disableCopyPaste ? "bg-[#BA1A1A]" : "bg-[#E1E2EC]"}`}>
                             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${disableCopyPaste ? "translate-x-7" : "translate-x-1"}`} />
                         </button>
                     </div>
                 </div>

                 {/* GAMIFICATION */}
                 {selectedMode === "quiz" && (
                 <div className="bg-[#FFFAEB] p-6 rounded-[28px] border border-[#FFE299] flex flex-col gap-4">
                     <h4 className="font-bold text-[#785900] text-lg mb-2 flex items-center gap-2"><Zap className="w-5 h-5 fill-current" /> Gamifikasi Pembelajaran</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex items-center justify-between">
                             <span className="font-medium text-[#785900]">Klasemen Interaktif</span>
                             <button type="button" onClick={() => setGamification(p => ({...p, leaderboard: !p.leaderboard}))} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${gamification.leaderboard ? "bg-[#D19B00]" : "bg-[#E1E2EC]"}`}>
                                 <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${gamification.leaderboard ? "translate-x-7" : "translate-x-1"}`} />
                             </button>
                         </div>
                         <div className="flex items-center justify-between">
                             <span className="font-medium text-[#785900]">Live Reactions Emoji</span>
                             <button type="button" onClick={() => setGamification(p => ({...p, liveReactions: !p.liveReactions}))} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${gamification.liveReactions ? "bg-[#D19B00]" : "bg-[#E1E2EC]"}`}>
                                 <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${gamification.liveReactions ? "translate-x-7" : "translate-x-1"}`} />
                             </button>
                         </div>
                         <div className="flex items-center justify-between">
                             <span className="font-medium text-[#785900]">Power Ups & Item</span>
                             <button type="button" onClick={() => setGamification(p => ({...p, powerUps: !p.powerUps}))} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${gamification.powerUps ? "bg-[#D19B00]" : "bg-[#E1E2EC]"}`}>
                                 <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${gamification.powerUps ? "translate-x-7" : "translate-x-1"}`} />
                             </button>
                         </div>
                         <div className="flex items-center justify-between">
                             <span className="font-medium text-[#785900]">Meme saat Menjawab</span>
                             <button type="button" onClick={() => setGamification(p => ({...p, showMeme: !p.showMeme}))} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${gamification.showMeme ? "bg-[#D19B00]" : "bg-[#E1E2EC]"}`}>
                                 <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${gamification.showMeme ? "translate-x-7" : "translate-x-1"}`} />
                             </button>
                         </div>
                         <div className="flex items-center justify-between">
                             <span className="font-medium text-[#785900]">Mainkan Musik Latar</span>
                             <button type="button" onClick={() => setGamification(p => ({...p, playMusic: !p.playMusic}))} className={`w-14 h-8 rounded-full flex items-center shrink-0 transition-colors ${gamification.playMusic ? "bg-[#D19B00]" : "bg-[#E1E2EC]"}`}>
                                 <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform ${gamification.playMusic ? "translate-x-7" : "translate-x-1"}`} />
                             </button>
                         </div>
                     </div>
                 </div>
                 )}
            </div>
            
            <div className="mt-8 flex justify-end">
                <button type="button" onClick={() => setActiveSection("publikasi")} className="px-8 py-4 bg-[#005AC1] hover:bg-[#004A9E] text-white rounded-full font-bold flex items-center gap-2 transition-colors">
                    Lanjut ke Rilis <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* SECTION: PUBLIKASI */}
        <div className={`flex flex-col gap-6 ${activeSection === "publikasi" ? "block" : "hidden"}`}>
            <div>
                <h3 className="text-3xl font-outfit font-black text-[#1B1B1F]">Rilis & Terbitkan</h3>
                <p className="text-sm text-[#44474E] mt-1 font-medium">Langkah terakhir sebelum ujian dibagikan ke siswa.</p>
            </div>
            <div className="bg-transparent mt-2 flex flex-col gap-10 items-center justify-center text-center py-10">
                
                <div className="w-32 h-32 bg-[#D3E4FF] rounded-[2.5rem] flex items-center justify-center text-[#005AC1] shadow-inner rotate-3">
                    <Check className="w-16 h-16" />
                </div>
                <div>
                    <h4 className="text-4xl font-outfit font-black text-[#1B1B1F]">Pratinjau Selesai</h4>
                    <p className="text-[#44474E] mt-6 max-w-sm text-lg leading-relaxed mx-auto">
                        Anda telah menyiapkan <span className="font-black text-[#001D35]">{questions.length} pertanyaan</span> untuk evaluasi berdurasi <span className="font-black text-[#001D35]">{duration}</span>.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row w-full justify-center gap-4 mt-8">
                    <button
                        type="button"
                        onClick={(e) => handleSaveEvaluation(e, true)}
                        className="py-5 px-10 rounded-full bg-white text-[#1B1B1F] font-bold text-lg border border-[#E1E2EC] hover:bg-[#E1E2EC] transition-colors cursor-pointer w-full sm:w-auto"
                    >
                        Simpan Draf
                    </button>
                    <button
                        type="submit"
                        className="py-5 px-10 rounded-full bg-[#005AC1] hover:bg-[#004A9E] text-white font-bold text-lg transition-all flex items-center justify-center gap-3 cursor-pointer w-full sm:w-auto shadow-xl shadow-[#005AC1]/20 hover:-translate-y-1"
                    >
                        <Send className="w-6 h-6" /> Terbitkan ke Kelas
                    </button>
                </div>
            </div>
        </div>

      </form>
      </div>
    </motion.div>
  );
}
