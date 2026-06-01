"use client";

import React from "react";
import { motion } from "motion/react";
import { History, Award, CheckCircle2, Clock, HelpCircle, FileText, FileSpreadsheet } from "lucide-react";
import { Submission } from "./types";

interface StudentHistoryProps {
  submissions: Submission[];
  userEmail: string;
}

export default function StudentHistory({ submissions, userEmail }: StudentHistoryProps) {
  // Filter submissions corresponding only to the active student's email
  const mySubmissions = submissions.filter(
    s => s.studentEmail.toLowerCase() === userEmail.toLowerCase()
  );

  const completedCount = mySubmissions.filter(s => s.status === "selesai").length;
  const pendingCount = mySubmissions.filter(s => s.status === "perlu_koreksi").length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pt-4 pb-20">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#D3E4FF] p-6 rounded-[28px] border border-transparent">
          <Award className="w-8 h-8 text-[#005AC1] mb-2" />
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#001D35] opacity-70">Total Menempuh</h4>
          <p className="text-3xl font-black font-outfit text-[#001D35] mt-1">{mySubmissions.length} Evaluasi</p>
        </div>

        <div className="bg-[#C0EFEF] p-6 rounded-[28px] border border-transparent">
          <CheckCircle2 className="w-8 h-8 text-teal-700 mb-2" />
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-teal-950 opacity-70">Selesai Dinilai</h4>
          <p className="text-3xl font-black font-outfit text-teal-950 mt-1">{completedCount} Berhasil</p>
        </div>

        <div className="bg-[#FFDF92] p-6 rounded-[28px] border border-transparent">
          <Clock className="w-8 h-8 text-[#785900] mb-2" />
          <h4 className="text-xs uppercase font-extrabold tracking-wider text-[#261A00] opacity-70">Menunggu Koreksi</h4>
          <p className="text-3xl font-black font-outfit text-[#261A00] mt-1">{pendingCount} Esai</p>
        </div>
      </div>

      {/* History log list */}
      <div className="bg-white border border-[#E1E2EC] p-6 rounded-[36px] flex flex-col gap-6 select-text">
        <h3 className="text-xl font-bold font-outfit text-[#1B1B1F]">Aktivitas Ujian Saya</h3>

        {mySubmissions.length === 0 ? (
          <div className="text-center py-12 text-[#9A9EB0]">
            <History className="w-12 h-12 mx-auto stroke-1 animate-pulse text-slate-300 mb-2" />
            <p className="text-sm font-bold">Belum ada riwayat pengerjaan ujian.</p>
            <p className="text-xs mt-1 text-slate-400">Silakan buka tab Kelas untuk mengerjakan evaluasi yang tersedia.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mySubmissions.map(sub => (
              <div key={sub.id} className="p-5 border rounded-2xl bg-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-[#1B1B1F] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1B1B1F]">{sub.quizTitle}</h4>
                    <p className="text-xs text-[#44474E] mt-0.5">{sub.className} • Tanggal: {sub.submitDate}</p>
                    
                    {/* Display score breaks */}
                    <div className="flex gap-4 mt-2 text-[11px] font-bold text-slate-500">
                      <span>Kunci Otomatis (MC): {sub.scoreMc}/100</span>
                      {sub.scoreEssay !== null && <span>Skor Esai (Guru): {sub.scoreEssay}/100</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    {sub.status === "perlu_koreksi" ? (
                      <span className="text-[10px] uppercase font-black bg-[#FFDF92] text-[#785900] px-3 py-1.5 rounded-full whitespace-nowrap">
                        Menunggu Koreksi
                      </span>
                    ) : (
                      <div className="space-y-0.5">
                        <span className="text-sm font-black text-[#006A6A] bg-teal-100 px-3 py-1.5 rounded-full whitespace-nowrap">
                          Skor Akhir: {sub.finalScore} / 100
                        </span>
                        <p className="text-[9px] italic text-[#44474E] font-bold text-slate-400 mt-1">Lulus kriteria</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
