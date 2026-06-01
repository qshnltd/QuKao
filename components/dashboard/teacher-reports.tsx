"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { BarChart3, FileSpreadsheet, ShieldAlert, CheckCircle2, Award, Sparkles, BookOpen, User, Calendar, Save, Trash2 } from "lucide-react";
import { Submission, ClassItem } from "./types";

interface TeacherReportsProps {
  submissions: Submission[];
  setSubmissions: React.Dispatch<React.SetStateAction<Submission[]>>;
  classes: ClassItem[];
}

export default function TeacherReports({ submissions, setSubmissions, classes }: TeacherReportsProps) {
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [essayScoreInput, setEssayScoreInput] = useState<number>(100);
  const [teacherFeedback, setTeacherFeedback] = useState("");
  
  // Filters
  const [filterMode, setFilterMode] = useState<"semua" | "ujian" | "quiz" | "form">("semua");
  const [filterClass, setFilterClass] = useState<string>("semua");
  
  // Gemini States
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const activeGradingSub = submissions.find(s => s.id === selectedSubId);

  // Statistics
  const completedSubs = submissions.filter(s => s.status === "selesai");
  const pendingCount = submissions.filter(s => s.status === "perlu_koreksi").length;

  const classAverages = classes.map(cls => {
    const clsSubs = completedSubs.filter(s => s.classId === cls.id);
    if (clsSubs.length === 0) return { label: cls.name, score: 75 }; // fallback default
    const total = clsSubs.reduce((acc, curr) => acc + (curr.finalScore || 0), 0);
    return { label: cls.name, score: Math.round(total / clsSubs.length) };
  });
  
  let filteredSubmissions = submissions;
  if (filterClass !== "semua") {
      filteredSubmissions = filteredSubmissions.filter(s => s.classId === filterClass);
  }
  if (filterMode !== "semua") {
      filteredSubmissions = filteredSubmissions.filter(s => {
          const cls = classes.find(c => c.id === s.classId);
          if (!cls) return false;
          const q = cls.quizzes.find(quiz => quiz.id === s.quizId);
          if (!q) return false;
          return q.type === filterMode;
      });
  }

  const handleOpenGrading = (sub: Submission) => {
    setSelectedSubId(sub.id);
    setEssayScoreInput(sub.essayAnswers[0]?.score || 100);
    setTeacherFeedback("");
  };

  const handleCommitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubId || !activeGradingSub) return;

    setSubmissions(prev => prev.map(sub => {
      if (sub.id === selectedSubId) {
        const scoreEssay = Number(essayScoreInput);
        const finalScore = Math.round((sub.scoreMc + scoreEssay) / 2); // average of MC and Essay
        
        return {
          ...sub,
          scoreEssay,
          finalScore,
          status: "selesai",
          essayAnswers: sub.essayAnswers.map(ans => ({
            ...ans,
            score: scoreEssay
          }))
        };
      }
      return sub;
    }));

    alert("Hasil koreksi berhasil disimpan!");
    setSelectedSubId(null);
  };

  const handleRequestAiAnalysis = async () => {
    setIsAiLoading(true);
    setAiAnalysis(null);

    const submissionContexts = submissions.map(s => 
      `- Siswa Name: ${s.studentName}, Quiz: ${s.quizTitle}, MC Score: ${s.scoreMc}, Essay Score: ${s.scoreEssay || "Belum Dinilai"}, Status: ${s.status}`
    ).join("\n");

    try {
      const payload = {
          messages: [{ role: "user", content: `Analisis performa kelas berdasarkan penyerahan kuis ini:\n${submissionContexts}\n\nBerikan laporan singkat, terstruktur, meliputi kekuatan siswa, kelemahan umum, dan langkah rekomendasi guru. Menggunakan bahasa Indonesia yang sopan dan profesional.` }],
          category: "tutor",
          systemPrompt: "You are an AI Professional Academic Analyst. Format reports cleanly in structured HTML/Markdown paragraphs."
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
        headers: { "Content-Type": "application/json" },
        body: safePayload
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
          setAiAnalysis(data.error || "Sistem AI sedang sibuk. Silakan coba lagi nanti.");
        } else {
          setAiAnalysis(data.content);
        }
      } else {
        setAiAnalysis(data.error || "Sistem analisis AI sedang sibuk. Silakan coba sesaat lagi.");
      }
    } catch (err: any) {
      console.error("AI Analysis Failed:", err);
      setAiAnalysis(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8 pt-4 pb-20">
      {/* Grid: Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#D3E4FF] p-6 rounded-[28px] border border-transparent">
          <BookOpen className="w-8 h-8 text-[#005AC1] mb-2" />
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#001D35] opacity-70">Belum Dikoreksi (Esai)</h4>
          <p className="text-3xl font-black font-outfit text-[#001D35] mt-1">{pendingCount} Tugas</p>
        </div>

        <div className="bg-[#FFDF92] p-6 rounded-[28px] border border-transparent">
          <CheckCircle2 className="w-8 h-8 text-[#785900] mb-2" />
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#261A00] opacity-70">Selesai Menilai</h4>
          <p className="text-3xl font-black font-outfit text-[#261A00] mt-1">{completedSubs.length} Siswa</p>
        </div>

        <div className="bg-[#C0EFEF] p-6 rounded-[28px] border border-transparent flex flex-col justify-between">
          <div>
            <Award className="w-8 h-8 text-[#006A6A] mb-2" />
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#002020] opacity-70">Rata-Rata Klasifikasi</h4>
            <p className="text-3xl font-black font-outfit text-[#002020] mt-1">87 Pts</p>
          </div>
        </div>
      </div>

      {/* Grid: Graph and AI Analyst */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Graph */}
        <div className="lg:col-span-6 bg-white border border-[#E1E2EC] p-6 rounded-[36px]">
          <h3 className="text-xl font-bold font-outfit text-[#1B1B1F] mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#005AC1]" /> Histogram Performa Kelas
          </h3>

          <div className="flex items-end gap-3 h-48 pt-4 border-t border-dashed border-[#E1E2EC]">
            {classAverages.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative">
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] font-black px-2.5 py-1.5 rounded-xl whitespace-nowrap">
                  {bar.score} Pts
                </div>
                <div 
                  style={{ height: `${bar.score}%` }}
                  className="w-full max-w-[48px] rounded-t-2xl bg-[#005AC1] hover:bg-[#004A9E] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-3 bg-white/20"></div>
                </div>
                <p className="text-[11px] font-black tracking-tight text-[#44474E] text-center line-clamp-1 w-full">{bar.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Helper */}
        <div className="lg:col-span-6 border border-[#E1E2EC] p-6 rounded-[36px] bg-[#EADDFF] text-[#21005D]">
          <div className="flex justify-between items-center gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-outfit flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#4F378B]" /> AI Analisis & Rekomendasi
              </h3>
              <p className="text-xs font-semibold text-[#4F378B] opacity-80">Gunakan kecerdasan buatan untuk meresum prestasi ujian siswa.</p>
            </div>
            <button
              onClick={handleRequestAiAnalysis}
              disabled={isAiLoading || submissions.length === 0}
              className="py-2.5 px-4 rounded-full bg-[#4F378B] text-white text-xs font-black cursor-pointer hover:opacity-90 active:scale-95  whitespace-nowrap"
            >
              {isAiLoading ? "Menganalisis..." : "Generate AI"}
            </button>
          </div>

          <div className="mt-4 border-t border-[#4F378B]/20 pt-4 h-[160px] overflow-y-auto">
            {aiAnalysis ? (
              <div className="text-xs font-medium text-[#21005D] leading-relaxed space-y-2 select-text whitespace-pre-line font-medium prose prose-sm text-slate-800">
                {aiAnalysis}
              </div>
            ) : isAiLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                <p className="text-xs font-bold animate-pulse text-[#4F378B]">Mengurai data nilai...</p>
              </div>
            ) : (
              <p className="text-xs font-medium opacity-70 text-[#4F378B] italic">Klik tombol &quot;Generate AI&quot; untuk me-review hasil belajar dalam hitungan detik.</p>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Live Interactive Grading */}
      <div className="bg-white border border-[#E1E2EC] p-6 rounded-[36px] mt-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-xl font-bold font-outfit text-[#1B1B1F]">Daftar Penyerahan Jawaban Siswa</h3>
            <div className="flex items-center gap-3">
                <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="bg-[#F3F4F9] border border-[#E1E2EC] text-[#1B1B1F] text-sm rounded-full px-4 py-2 font-bold outline-none cursor-pointer hover:border-[#005AC1] hover:bg-[#D3E4FF]/30 transition-colors">
                    <option value="semua">Semua Kelas</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={filterMode} onChange={(e) => setFilterMode(e.target.value as any)} className="bg-[#F3F4F9] border border-[#E1E2EC] text-[#1B1B1F] text-sm rounded-full px-4 py-2 font-bold outline-none cursor-pointer hover:border-[#005AC1] hover:bg-[#D3E4FF]/30 transition-colors">
                    <option value="semua">Semua Evaluasi</option>
                    <option value="ujian">Ujian</option>
                    <option value="quiz">Quiz</option>
                    <option value="form">Form</option>
                </select>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#E1E2EC] text-xs font-extrabold text-[#44474E] uppercase tracking-wider">
                <th className="py-4 px-4 font-extrabold">Siswa</th>
                <th className="py-4 px-4 font-extrabold">Ujian/Kuis</th>
                <th className="py-4 px-4 font-extrabold">Tanggal</th>
                <th className="py-4 px-4 font-extrabold">Auto-MC</th>
                <th className="py-4 px-4 font-extrabold">Essay</th>
                <th className="py-4 px-4 font-extrabold">Akhir</th>
                <th className="py-4 px-4 font-extrabold">Status</th>
                <th className="py-4 px-4 text-center font-extrabold">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                  <tr>
                      <td colSpan={8} className="py-8 text-center text-[#44474E] font-medium">Berdasarkan filter Anda, belum ada penyerahan yang ditemukan.</td>
                  </tr>
              ) : filteredSubmissions.map(sub => (
                <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors font-medium">
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#1B1B1F]">{sub.studentName}</p>
                    <p className="text-xs text-[#44474E]">{sub.studentEmail}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-[#1B1B1F]">{sub.quizTitle}</p>
                    <p className="text-xs text-[#44474E]">{sub.className}</p>
                  </td>
                  <td className="py-4 px-4 text-xs font-bold text-[#44474E]">{sub.submitDate}</td>
                  <td className="py-4 px-4 font-bold text-[#005AC1]">{sub.scoreMc} pts</td>
                  <td className="py-4 px-4 font-bold">
                    {sub.scoreEssay !== null ? `${sub.scoreEssay} pts` : <span className="text-amber-600 font-extrabold text-xs">Butuh Penilaian</span>}
                  </td>
                  <td className="py-4 px-4">
                    {sub.finalScore !== null ? (
                      <span className="font-black text-[#006A6A]">{sub.finalScore} pts</span>
                    ) : (
                      <span className="text-slate-400">---</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full ${
                      sub.status === "selesai" ? "bg-emerald-100 text-emerald-800" : "bg-[#FFDF92] text-[#785900]"
                    }`}>
                      {sub.status === "selesai" ? "Dinilai" : "Menunggu"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => handleOpenGrading(sub)}
                      className="px-3 py-1.5 rounded-full bg-[#005AC1] hover:bg-[#004A9E] text-white text-xs font-bold cursor-pointer transition-colors"
                    >
                      Koreksi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Sidebar Form for Grading */}
      {selectedSubId && activeGradingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border rounded-[40px] max-w-2xl w-full p-6 md:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto ">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-2xl font-outfit font-black text-[#1B1B1F]">Koreksi Lembar Jawaban</h3>
                <p className="text-xs text-[#44474E] font-medium mt-0.5">Siswa: {activeGradingSub.studentName} • {activeGradingSub.quizTitle}</p>
              </div>
              <button
                onClick={() => setSelectedSubId(null)}
                className="w-10 h-10 rounded-full bg-slate-100 text-[#1B1B1F] flex items-center justify-center font-bold font-sans cursor-pointer hover:bg-slate-200"
              >
                &times;
              </button>
            </div>

            <div className="space-y-6">
              {/* Auto graded info */}
              <div className="p-4 bg-[#D3E4FF] rounded-2xl border border-transparent text-[#001D35] flex justify-between items-center">
                <span className="text-sm font-bold">Skor Pilihan Ganda (Otomatis):</span>
                <span className="text-lg font-black">{activeGradingSub.scoreMc} / 100 Pts</span>
              </div>

              {/* Answers */}
              <div className="space-y-4">
                <h4 className="text-sm font-black text-[#1B1B1F] uppercase tracking-wider">Lembar Jawaban Esai</h4>
                {activeGradingSub.essayAnswers.map((ans, i) => (
                  <div key={ans.questionId} className="p-4 rounded-2xl bg-slate-50 border border-[#E1E2EC] space-y-2">
                    <p className="text-xs font-bold text-slate-500">Soal {i+1}:</p>
                    <p className="text-sm font-bold text-[#1B1B1F] leading-snug">{ans.questionText}</p>
                    <div className="p-3 bg-white border rounded-xl mt-2">
                      <p className="text-xs font-bold text-amber-800">Jawaban Siswa:</p>
                      <p className="text-xs font-medium text-slate-700 mt-1 whitespace-pre-line select-text leading-relaxed font-sans">{ans.studentAnswer}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Score form */}
              <form onSubmit={handleCommitGrade} className="space-y-4 pt-4 border-t">
                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-bold text-[#1B1B1F]">Berikan Skor Esai (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={essayScoreInput}
                    onChange={(e) => setEssayScoreInput(Number(e.target.value))}
                    className="p-3.5 bg-slate-50 border border-[#C4C6D0] rounded-2xl text-sm font-bold focus:border-[#005AC1]"
                    required
                  />
                </div>

                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-bold text-[#1B1B1F]">Catatan / Feedback Guru (Opsional)</label>
                  <textarea
                    rows={2}
                    value={teacherFeedback}
                    onChange={(e) => setTeacherFeedback(e.target.value)}
                    placeholder="Contoh: Jawaban sangat tepat dan penjelasan konsep diskriminannya mendalam. Pertahankan!"
                    className="p-3.5 bg-slate-50 border border-[#C4C6D0] rounded-2xl text-xs font-medium leading-relaxed font-sans focus:border-[#005AC1]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedSubId(null)}
                    className="px-5 py-3 rounded-2xl bg-[#E1E2EC] text-[#1B1B1F] text-xs font-bold font-sans cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-[#005AC1] hover:bg-[#004A9E] text-white text-xs font-black flex items-center gap-2 cursor-pointer "
                  >
                    <Save className="w-4 h-4" /> Simpan Skor Akhir
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
