"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Users, ArrowRight, Download, CheckCircle, Clock, Send, MessageSquare, ChevronRight, Hash, Zap, GraduationCap, ArrowLeft, Play } from "lucide-react";
import { ClassItem, Submission, QuizItem, DiscussionItem } from "./types";

const getNextSubId = () => "sub-" + new Date().getTime();
const getNextClassId = (code: string) => `cls-${new Date().getTime()}`;

interface StudentClassesProps {
  classes: ClassItem[];
  setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
  userEmail: string;
  userName: string;
}

export default function StudentClasses({ classes, setClasses, submissions, setSubmissions, userEmail, userName }: StudentClassesProps) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [classCodeInput, setClassCodeInput] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinFeedback, setJoinFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Detail Subtabs
  const [activeSubTab, setActiveSubTab] = useState<"materi" | "quiz" | "diskusi">("materi");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [discussionInput, setDiscussionInput] = useState("");

  const [activeTakingQuiz, setActiveTakingQuiz] = useState<QuizItem | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: string }>({});
  const [quizTimer, setQuizTimer] = useState<number>(0); // in seconds

  const selectedClass = classes.find(c => c.id === selectedClassId);

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classCodeInput.trim()) return;

    setIsJoining(true);
    setJoinFeedback(null);

    setTimeout(() => {
      const code = classCodeInput.trim().toUpperCase();
      
      // Check if code matches any class in database
      const existingClass = classes.find(cls => cls.code === code);
      if (existingClass) {
        setJoinFeedback({ type: "success", message: `Berhasil bergabung ke kelas "${existingClass.name}"!` });
        setSelectedClassId(existingClass.id);
        setClassCodeInput("");
        setIsJoining(false);
        setTimeout(() => setJoinFeedback(null), 3000);
        return;
      }

      // Generate a dynamic class with the code!
      const newClass: ClassItem = {
        id: getNextClassId(code),
        name: `Kelas Tambahan (${code})`,
        code: code,
        teacher: "Dosen Pengampu Tamu",
        bg: "bg-[#EADDFF]",
        textColor: "text-[#21005D]",
        icon: "GraduationCap",
        students: 24,
        materials: [
          { id: "gen-m1", title: "Pengenalan Umum Kuliah Lengkap.pdf", size: "1.2 MB" }
        ],
        quizzes: [
          { 
            id: `gen-q1`, 
            title: "Kuis Diagnostik Awal", 
            duration: "10 Menit", 
            done: false, 
            score: null,
            type: "quiz",
            questions: [
              {
                id: "gen-q1-1",
                text: "Siapakah bapak pencetus mekanika klasik?",
                type: "pilihan_ganda",
                options: ["A. Isaac Newton", "B. Albert Einstein", "C. Niels Bohr", "D. Marie Curie"],
                correctAnswer: "A"
              },
              {
                id: "gen-q1-2",
                text: "Bagaimana motivasi Anda mempelajari mata pelajaran ini?",
                type: "esai"
              }
            ]
          }
        ],
        discussions: [
          { id: "gen-d1", sender: "Sistem Kelas", text: "Selamat bergabung di kelas tambahan baru! Silakan pelajari materi awal Anda.", date: "Baru saja" }
        ]
      };

      setClasses(prev => [newClass, ...prev]);
      setIsJoining(false);
      setJoinFeedback({ type: "success", message: `Berhasil membuat kelas baru "${newClass.name}"!` });
      setSelectedClassId(newClass.id);
      setClassCodeInput("");

      setTimeout(() => setJoinFeedback(null), 3000);
    }, 800);
  };

  const handleDownload = (materialId: string) => {
    if (downloadedIds.includes(materialId)) return;
    setDownloadingId(materialId);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          setDownloadedIds(subPrev => [...subPrev, materialId]);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleSendDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim() || !selectedClassId) return;

    setClasses(prev => prev.map(cls => {
      if (cls.id === selectedClassId) {
        return {
          ...cls,
          discussions: [
            ...cls.discussions,
            {
              id: `disc-${Date.now()}`,
              sender: `${userName} (Siswa)`,
              text: discussionInput.trim(),
              date: "Baru saja"
            }
          ]
        };
      }
      return cls;
    }));

    setDiscussionInput("");
  };

  const startQuizWizard = (quiz: QuizItem) => {
    setActiveTakingQuiz(quiz);
    setQuizAnswers({});
    const minVal = parseInt(quiz.duration);
    setQuizTimer(isNaN(minVal) ? 900 : minVal * 60); // minutes to seconds
  };

  const handleRadioSelect = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleEssayType = (questionId: string, answer: string) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleAutoSubmit = () => {
    alert("Waktu habis! Jawaban Anda akan otomatis didokumentasikan.");
    submitQuizAnswers();
  };

  const submitQuizAnswers = () => {
    if (!activeTakingQuiz || !selectedClass) return;

    const questions = activeTakingQuiz.questions;
    let correctCount = 0;
    let mcCount = 0;
    const essayAnswersList: any[] = [];

    questions.forEach(q => {
      const studentAns = quizAnswers[q.id] || "";
      if (q.type === "pilihan_ganda") {
        mcCount++;
        if (studentAns.trim().toUpperCase() === q.correctAnswer?.toUpperCase()) {
          correctCount++;
        }
      } else {
        essayAnswersList.push({
          questionId: q.id,
          questionText: q.text,
          studentAnswer: studentAns || "Tidak menjawab",
          score: null
        });
      }
    });

    // Score MC over 100
    const scoreMc = mcCount > 0 ? Math.round((correctCount / mcCount) * 100) : 100;
    const hasEssay = essayAnswersList.length > 0;
    const status = hasEssay ? "perlu_koreksi" : "selesai";
    const finalScore = hasEssay ? null : scoreMc;

    // Save submission
    const newSubmission: Submission = {
      id: getNextSubId(),
      classId: selectedClass.id,
      className: selectedClass.name,
      quizId: activeTakingQuiz.id,
      quizTitle: activeTakingQuiz.title,
      studentName: userName,
      studentEmail: userEmail,
      submitDate: "Hari ini, Baru saja",
      scoreMc,
      scoreEssay: null,
      finalScore,
      essayAnswers: essayAnswersList,
      status
    };

    setSubmissions(prev => [newSubmission, ...prev]);

    // Change class-quiz to done
    setClasses(prev => prev.map(cls => {
      if (cls.id === selectedClass.id) {
        return {
          ...cls,
          quizzes: cls.quizzes.map(q => q.id === activeTakingQuiz.id ? { ...q, done: true, score: finalScore } : q)
        };
      }
      return cls;
    }));

    setActiveTakingQuiz(null);
    alert(hasEssay ? "Jawaban terkirim! Guru Anda akan mengoreksi esai secepatnya." : `Kuis selesai! Skor otomatis Anda: ${scoreMc}`);
  };

  // Timer Effect
  useEffect(() => {
    if (!activeTakingQuiz || quizTimer <= 0) {
      if (activeTakingQuiz && quizTimer === 0) {
        handleAutoSubmit();
      }
      return;
    }

    const interval = setInterval(() => {
      setQuizTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTakingQuiz, quizTimer]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getIconComponent = (key: string) => {
    switch(key) {
      case "Hash": return <Hash className="w-5 h-5 text-[#005AC1]" />;
      case "Zap": return <Zap className="w-5 h-5 text-[#8E4A00]" />;
      case "BookOpen": return <BookOpen className="w-5 h-5 text-teal-600" />;
      default: return <GraduationCap className="w-5 h-5 text-indigo-600" />;
    }
  };

  if (selectedClassId && selectedClass) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pt-4 pb-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedClassId(null)}
            className="w-10 h-10 rounded-full bg-[#E1E2EC] text-[#1B1B1F] flex items-center justify-center font-bold cursor-pointer hover:opacity-80 transition-all "
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-outfit font-black text-[#1B1B1F] tracking-tight">{selectedClass.name}</h2>
            <p className="text-xs text-[#44474E] font-medium">Pengajar: {selectedClass.teacher} • Kode: {selectedClass.code}</p>
          </div>
        </div>

        {/* Dynamic Class detail subtabs */}
        <div className="flex border-b border-[#E1E2EC] gap-2 pt-2">
          {["materi", "quiz", "diskusi"].map((subtab) => (
            <button
              key={subtab}
              onClick={() => setActiveSubTab(subtab as any)}
              className={`pb-3 px-6 text-sm font-extrabold uppercase tracking-widest transition-all cursor-pointer border-b-4 ${
                activeSubTab === subtab ? "border-[#005AC1] text-[#005AC1]" : "border-transparent text-[#44474E] hover:text-[#1B1B1F]"
              }`}
            >
              {subtab === "quiz" ? "Evaluasi" : subtab}
            </button>
          ))}
        </div>

        {/* SUBTAB CONTENT */}
        <div className="mt-8 flex flex-col gap-8 min-h-[300px]">
          {/* MATERI VIEW */}
          {activeSubTab === "materi" && (
            <div className="flex flex-col gap-6">
              {selectedClass.materials.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-base font-bold text-[#44474E]">Belum ada materi pelajaran</p>
                  <p className="text-sm text-[#44474E] mt-1">Materi pelajaran berformat PDF akan ditampilkan di sini setelah dirilis oleh guru.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[#E1E2EC]/60 md:px-2">
                  {selectedClass.materials.map(mat => (
                    <div key={mat.id} className="py-5 flex items-center justify-between gap-4 group first:pt-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#D3E4FF] text-[#005AC1] flex items-center justify-center font-black text-xs shrink-0 select-none">
                          PDF
                        </div>
                        <div>
                          <p className="text-base font-black text-[#1B1B1F] group-hover:text-[#005AC1] transition-colors">{mat.title}</p>
                          <p className="text-sm text-[#44474E] font-medium mt-0.5">{mat.size}</p>
                        </div>
                      </div>

                      {downloadingId === mat.id ? (
                        <div className="flex flex-col items-end gap-1.5 shrink-0 pr-2">
                          <span className="text-[10px] font-black tracking-wider text-[#005AC1]">Mengunduh: {downloadProgress}%</span>
                          <div className="w-24 h-2 bg-[#E1E2EC] rounded-full overflow-hidden">
                            <div style={{ width: `${downloadProgress}%` }} className="h-full bg-[#005AC1] transition-all" />
                          </div>
                        </div>
                      ) : downloadedIds.includes(mat.id) ? (
                        <span className="text-xs font-bold text-[#006A3F] bg-[#DFF1EB] px-4 py-2 rounded-full flex items-center gap-1.5 shrink-0 select-none">
                          <CheckCircle className="w-4 h-4 text-[#006A3F]" /> Berhasil
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDownload(mat.id)}
                          className="w-12 h-12 rounded-full bg-[#E1E2EC] hover:bg-[#D4D6E0] text-[#1B1B1F] flex items-center justify-center transition-all cursor-pointer hover:scale-105 shrink-0"
                          title="Unduh PDF"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QUIZ VIEW */}
          {activeSubTab === "quiz" && (
            <div className="flex flex-col gap-6">
                  {selectedClass.quizzes.filter(q => !q.isDraft).length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-base font-bold text-[#44474E]">Belum ada evaluasi aktif</p>
                      <p className="text-sm text-[#44474E] mt-1">Evaluasi kelas akan muncul di sini setelah dirilis oleh guru kelasmu.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col divide-y divide-[#E1E2EC]/60 md:px-2">
                      {selectedClass.quizzes.filter(q => !q.isDraft).map(quiz => {
                        const matchedSub = submissions.find(s => s.quizId === quiz.id);
                    return (
                      <div key={quiz.id} className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0 group">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#FFDF92] text-[#785900] flex items-center justify-center shrink-0 select-none">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-base font-black text-[#1B1B1F] group-hover:text-[#005AC1] transition-colors">{quiz.title}</p>
                            <p className="text-sm text-[#44474E] font-medium mt-0.5">Durasi pengerjaan {quiz.duration} • {quiz.questions.length} Soal Ujian</p>
                          </div>
                        </div>

                        {quiz.done ? (
                          <div className="self-start sm:self-auto shrink-0 select-none">
                            {matchedSub?.status === "perlu_koreksi" ? (
                              <span className="text-xs font-bold text-[#785900] bg-[#FFDF92]/10 border border-[#FFDF92] px-4 py-2 rounded-full whitespace-nowrap inline-block">
                                Menunggu Koreksi
                              </span>
                            ) : (
                              <span className="text-xs font-black text-[#006A6A] bg-[#C0EFEF]/50 px-4 py-2 rounded-full whitespace-nowrap inline-block">
                                Nilai: {matchedSub?.finalScore || quiz.score || 100} / 100
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => startQuizWizard(quiz)}
                            className="px-6 py-3 bg-[#005AC1] hover:bg-[#004A9E] text-white text-sm font-black rounded-full flex items-center gap-2 cursor-pointer active:scale-95 transition-transform self-start sm:self-auto shrink-0 select-none"
                          >
                            <Play className="w-4 h-4 fill-white" /> Mulai Ujian
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* DISKUSI VIEW */}
          {activeSubTab === "diskusi" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6 bg-transparent">
                {/* Chat window - transparent elegant layout */}
                <div className="h-[480px] overflow-y-auto pr-2 space-y-4 flex flex-col-reverse divide-y divide-transparent">
                  <div className="space-y-4">
                    {selectedClass.discussions.map(disc => (
                      <div key={disc.id} className="p-5 bg-white border border-[#E1E2EC] rounded-[28px] rounded-bl-[4px] max-w-2xl select-text transition-shadow hover:shadow-sm">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-black text-[#005AC1]">{disc.sender}</span>
                          <span className="text-[10px] font-bold text-[#44474E] opacity-70">• {disc.date}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-800 leading-relaxed">{disc.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendDiscussion} className="flex gap-3 items-center mt-2">
                  <input
                    type="text"
                    value={discussionInput}
                    onChange={(e) => setDiscussionInput(e.target.value)}
                    placeholder="Sukai atau tanyakan hal baru di diskusi..."
                    className="flex-1 bg-white border border-[#E1E2EC] rounded-full px-6 py-4 text-sm font-bold outline-none text-[#1B1B1F] focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 transition-all placeholder:font-normal placeholder:text-[#8D9199]"
                  />
                  <button
                    type="submit"
                    disabled={!discussionInput.trim()}
                    className="w-14 h-14 rounded-full bg-[#005AC1] hover:bg-[#004A9E] text-white flex items-center justify-center transition-all disabled:bg-[#E1E2EC] disabled:text-[#44474E] cursor-pointer shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* FULLSCREEN QUIZ TAKING MODAL */}
        {activeTakingQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-black/40 backdrop-blur-md">
            <div className="bg-[#F8F9FF] rounded-[48px] max-w-3xl w-full p-8 md:p-12 flex flex-col gap-8 max-h-[95vh] overflow-y-auto ">
              <div className="flex justify-between items-center pb-2">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#785900] bg-[#FFDF92] px-4 py-1.5 rounded-full">
                    Sesi Pengerjaan Ujian
                  </span>
                  <h3 className="text-3xl font-outfit font-black text-[#1B1B1F] mt-3 tracking-tight">{activeTakingQuiz.title}</h3>
                </div>
                <div className="bg-[#FFDAD6] text-[#410002] px-6 py-3 rounded-[20px] flex items-center gap-2 font-black text-lg ">
                  <Clock className="w-4 h-4" /> {formatTimer(quizTimer)}
                </div>
              </div>

              {/* Questions Area */}
              <div className="space-y-6">
                {activeTakingQuiz.questions.map((q, index) => (
                  <div key={q.id} className="p-5 border rounded-2xl bg-neutral-50 flex flex-col gap-4">
                    <p className="text-sm font-bold text-[#1B1B1F]">
                      <span className="text-[#005AC1] font-black mr-1">{index + 1}.</span> {q.text}
                    </p>

                    {q.type === "pilihan_ganda" && q.options ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {["A", "B", "C", "D"].map((optLabel, optIndex) => {
                          const optionText = q.options![optIndex];
                          const isSelected = quizAnswers[q.id] === optLabel;
                          return (
                            <button
                              key={optLabel}
                              type="button"
                              onClick={() => handleRadioSelect(q.id, optLabel)}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs font-bold transition-all hover:bg-slate-100 cursor-pointer ${
                                isSelected ? "border-[#005AC1] bg-[#D3E4FF] text-[#001D35]" : "border-slate-300 bg-white"
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-[#005AC1] text-white" : "bg-neutral-100 text-slate-800"
                              }`}>
                                {optLabel}
                              </span>
                              <span className="line-clamp-2">{optionText}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="pt-2">
                        <textarea
                          rows={3}
                          value={quizAnswers[q.id] || ""}
                          onChange={(e) => handleEssayType(q.id, e.target.value)}
                          placeholder="Ketikkan jawaban esai lengkap Anda disini..."
                          className="w-full text-xs font-bold p-3 border rounded-xl placeholder-[#9A9EB0] outline-none focus:border-[#005AC1]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit panel */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={submitQuizAnswers}
                  className="px-8 py-3.5 rounded-2xl bg-[#005AC1] hover:bg-[#004A9E] text-white text-xs font-black cursor-pointer  active:scale-95 transition-transform flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Serahkan Jawaban
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pt-4 pb-20">
      {/* Code input to join */}
      <form onSubmit={handleJoinClass} className="flex gap-2 max-w-md items-center bg-white p-2 rounded-[28px] border border-[#E1E2EC] focus-within:border-[#005AC1] transition-colors">
        <input
          type="text"
          value={classCodeInput}
          onChange={(e) => setClassCodeInput(e.target.value)}
          placeholder="Masukkan Kode Kelas (Contoh: M3-CHEM)"
          className="flex-1 bg-transparent px-4 text-xs font-bold outline-none text-[#1B1B1F] placeholder-slate-400 capitalize"
          disabled={isJoining}
        />
        <button
          type="submit"
          disabled={isJoining || !classCodeInput.trim()}
          className="py-3 px-6 rounded-[22px] bg-[#005AC1] hover:bg-[#004A9E] text-white text-xs font-black transition-all cursor-pointer whitespace-nowrap active:scale-95 font-sans"
        >
          {isJoining ? "Bergabung..." : "Masuk Kelas"}
        </button>
      </form>

      {joinFeedback && (
        <div className={`p-4 rounded-2xl text-xs font-bold border max-w-md ${
          joinFeedback.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-[#FFDAD6] text-[#410002] border-[#FFB4AB]"
        }`}>
          {joinFeedback.message}
        </div>
      )}

      {/* Grid: Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {classes.map(cls => (
          <div
            key={cls.id}
            onClick={() => setSelectedClassId(cls.id)}
            className={`${cls.bg} hover:scale-[0.98] cursor-pointer transition-transform duration-200 min-h-[180px] p-6 rounded-[36px] flex flex-col justify-between group relative overflow-hidden`}
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-[18px] bg-white flex items-center justify-center shrink-0 ">
                {getIconComponent(cls.icon)}
              </div>
              <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </div>

            <div>
              <p className="text-[10px] tracking-widest font-black uppercase text-[#44474E]">{cls.code}</p>
              <h3 className={`text-2xl font-outfit font-black ${cls.textColor} line-clamp-1 mt-1`}>{cls.name}</h3>
              <p className={`text-xs font-medium ${cls.textColor} opacity-80 mt-1`}>{cls.teacher}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
