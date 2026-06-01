"use client";

import React, { useState } from "react";
import * as motion from "motion/react-client";
import { 
  Users, ArrowRight, Clock, MessageSquare, PlusCircle, LayoutDashboard, 
  BookOpen, BrainCircuit, Calendar, TrendingUp, AlertTriangle, CheckCircle, 
  FileText, Sparkles, Activity, Play, Star, Award, BarChart3, Bell
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

interface TeacherDashboardProps {
  name: string;
  activeClassesCount: number;
  pendingCount: number;
  completedCount: number;
  onNavigate: (tab: string) => void;
  classes: any[];
}

const performData = [
  { name: 'Sen', score: 72, target: 80 },
  { name: 'Sel', score: 75, target: 80 },
  { name: 'Rab', score: 82, target: 80 },
  { name: 'Kam', score: 78, target: 80 },
  { name: 'Jum', score: 85, target: 80 },
  { name: 'Sab', score: 90, target: 80 },
  { name: 'Min', score: 88, target: 80 },
];

export default function TeacherHome({ name, activeClassesCount, pendingCount, completedCount, onNavigate, classes }: TeacherDashboardProps) {
  const [showNotification, setShowNotification] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      {/* Announcement Banner */}
      {showNotification && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#005AC1] to-[#00397A] rounded-3xl p-6 flex items-center justify-between shadow-lg relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 hidden sm:flex">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white text-[#005AC1] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pembaruan</span>
                <span className="text-white/80 text-sm font-medium flex items-center gap-1"><Clock className="w-4 h-4"/> Hari ini</span>
              </div>
              <h2 className="text-2xl font-outfit font-black text-white tracking-tight">Selamat Datang di QuKao Enhanced!</h2>
              <p className="text-white/90 font-medium text-sm sm:text-base mt-1 max-w-2xl">Jelajahi fitur terbaru: AI Smart Assistant, pembuatan soal otomatis, rubrik grading pintar, dan mode interaksi kelas yang lebih seru.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNotification(false)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10 shrink-0 self-start sm:self-center cursor-pointer"
          >
             <ArrowRight className="w-5 h-5 rotate-45 transform" />
          </button>
        </motion.div>
      )}

      {/* Greeting & Date */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-2">
         <div>
            <h1 className="text-3xl font-outfit font-black text-[#1B1B1F]">Halo, {name}! 👋</h1>
            <p className="text-[#44474E] font-medium mt-1">Siap menginspirasi siswa hari ini?</p>
         </div>
         <div className="flex gap-2">
            <button 
               onClick={() => onNavigate("create")}
               className="bg-[#005AC1] hover:bg-[#004799] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-md"
            >
              <PlusCircle className="w-5 h-5" /> Buat Aktivitas
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-2">
        {/* Main Left Column (8 cols) */}
        <div className="md:col-span-8 flex flex-col gap-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
               icon={<Users className="w-6 h-6" />} 
               label="Total Siswa" 
               value="128" 
               trend="+12%" 
               trendUp={true} 
               color="blue"
            />
            <StatCard 
               icon={<BookOpen className="w-6 h-6" />} 
               label="Kelas Aktif" 
               value={activeClassesCount.toString()} 
               trend="Stabil" 
               trendUp={true} 
               color="purple"
            />
            <StatCard 
               icon={<CheckCircle className="w-6 h-6" />} 
               label="Avg. Score" 
               value="84" 
               trend="+2.5" 
               trendUp={true} 
               color="green"
            />
            <StatCard 
               icon={<Activity className="w-6 h-6" />} 
               label="Perlu Koreksi" 
               value={pendingCount.toString()} 
               trend="-5 hari ini" 
               trendUp={false} 
               color="amber"
               onClick={() => onNavigate("reports")}
            />
          </div>

          {/* Performance Chart & AI Insight */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
             {/* Graph */}
             <div className="col-span-2 bg-white rounded-3xl border border-[#E1E2EC] p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <div>
                      <h3 className="font-outfit font-black text-xl text-[#1B1B1F]">Performa Kelas</h3>
                      <p className="text-[#44474E] text-sm mt-1">Rata-rata nilai ujian minggu ini</p>
                   </div>
                   <div className="bg-[#F3F4F9] text-[#001D35] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E1E2EC]">Minggu Ini</div>
                </div>
                <div className="h-56 w-full relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={performData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <defs>
                         <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#005AC1" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#005AC1" stopOpacity={0}/>
                         </linearGradient>
                       </defs>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#74777F' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#74777F' }} />
                       <CartesianGrid vertical={false} stroke="#E1E2EC" strokeDasharray="4 4" />
                       <RechartsTooltip 
                         contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontWeight: 'bold' }}
                         itemStyle={{ color: '#005AC1' }}
                       />
                       <Area type="monotone" dataKey="score" stroke="#005AC1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" activeDot={{ r: 6, strokeWidth: 0, fill: '#BA1A1A' }} />
                     </AreaChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* AI Insights Insight */}
             <div className="col-span-1 bg-[#FDF8FC] rounded-3xl border border-[#F2D1E1] p-6 shadow-sm flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <BrainCircuit className="w-24 h-24 text-[#8C1D18]" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-8 h-8 rounded-full bg-[#FFD9E2] text-[#8C1D18] flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                   </div>
                   <h3 className="font-outfit font-black text-lg text-[#31111D]">AI Insight</h3>
                </div>
                
                <div className="flex-1 flex flex-col gap-3 relative z-10">
                   <InsightCard 
                     type="warning" 
                     title="Remedial Diperlukan" 
                     desc="5 siswa di Matematika X-IPA 1 mendapat nilai < 60 di Quiz Aljabar."
                   />
                   <InsightCard 
                     type="info" 
                     title="Soal Paling Sulit" 
                     desc="Materi 'Gerak Melingkar' tingkat benar hanya 32%."
                   />
                   <InsightCard 
                     type="success" 
                     title="Peningkatan!" 
                     desc="Kelas Biologi XII menunjukkan kenaikan progres baca 15%."
                   />
                </div>
                
                <button 
                  onClick={() => onNavigate("reports")}
                  className="mt-4 w-full bg-[#8C1D18] hover:bg-[#680005] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm"
                >
                   Lihat Detail Laporan <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>

          {/* Quick Actions & Continue Working */}
          <div className="bg-white rounded-3xl border border-[#E1E2EC] p-6 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-outfit font-black text-xl text-[#1B1B1F]">Lanjutkan Bekerja</h3>
                <div className="flex gap-2">
                   <ActionBtn icon={<Clock className="w-4 h-4" />} label="Baru Saja" />
                   <ActionBtn icon={<Star className="w-4 h-4" />} label="Favorit" />
                </div>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ContinueCard 
                   icon={<BookOpen />} 
                   title="Modul Aljabar Linear Dasar" 
                   subtitle="Draft • Diperbarui 2 jam lalu" 
                   color="blue"
                   onNavigate={() => onNavigate("create")}
                />
                <ContinueCard 
                   icon={<LayoutDashboard />} 
                   title="Uji Kompetensi: Termodinamika" 
                   subtitle="Quiz • 5 Soal • Belum Rilis" 
                   color="purple"
                   onNavigate={() => onNavigate("create")}
                />
             </div>
          </div>
          
          {/* Teacher Productivity Streak & Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-[#1B1B1F] to-[#2F3036] rounded-3xl p-6 flex flex-col justify-center shadow-lg text-white gap-6 relative overflow-hidden">
               <div className="absolute right-0 top-0 opacity-10">
                 <Award className="w-48 h-48 -mr-10 -mt-10" />
               </div>
               <div className="flex items-center gap-6 relative z-10">
                  <div className="relative shrink-0">
                     <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border-4 border-[#005AC1]">
                        <span className="font-outfit font-black text-3xl">12</span>
                     </div>
                     <div className="absolute -bottom-2 -right-2 bg-[#FFBA26] p-1.5 rounded-full border-2 border-[#1B1B1F]">
                        <Award className="w-5 h-5 text-[#410002]" />
                     </div>
                  </div>
                  <div>
                     <h3 className="font-outfit font-black text-2xl tracking-tight mb-1">Hari Streak🔥</h3>
                     <p className="text-[#C4C6D0] text-sm">Aktif memeriksa tugas & memandu siswa 12 hari berturut-turut.</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E1E2EC] p-6 shadow-sm flex flex-col justify-center">
              <h3 className="font-outfit font-black text-lg text-[#1B1B1F] mb-4">Akses Cepat</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => onNavigate("classes")} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F3F4F9] hover:bg-[#D3E4FF] transition-colors cursor-pointer text-left">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-[#005AC1]" />
                  </div>
                  <span className="text-sm font-bold text-[#1B1B1F] leading-tight">Manajemen<br/>Siswa</span>
                </button>
                <button onClick={() => onNavigate("discover")} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F3F4F9] hover:bg-[#C4EED0] transition-colors cursor-pointer text-left">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-[#146C2E]" />
                  </div>
                  <span className="text-sm font-bold text-[#1B1B1F] leading-tight">Bank<br/>Materi</span>
                </button>
                <button onClick={() => onNavigate("reports")} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F3F4F9] hover:bg-[#FFDF92] transition-colors cursor-pointer text-left">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#785900]" />
                  </div>
                  <span className="text-sm font-bold text-[#1B1B1F] leading-tight">Laporan<br/>Nilai</span>
                </button>
                <button onClick={() => onNavigate("create")} className="flex items-center gap-3 p-3 rounded-2xl bg-[#F3F4F9] hover:bg-[#EADDFF] transition-colors cursor-pointer text-left">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                    <BrainCircuit className="w-5 h-5 text-[#4F378B]" />
                  </div>
                  <span className="text-sm font-bold text-[#1B1B1F] leading-tight">AI<br/>Soal Generator</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-6">
           
           {/* Upcoming Schedule */}
           <div className="bg-white rounded-3xl border border-[#E1E2EC] p-6 shadow-sm flex-1">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-outfit font-black text-xl text-[#1B1B1F]">Jadwal & Deadline</h3>
                 <button className="text-[#005AC1] p-2 hover:bg-[#D3E4FF] rounded-full transition-colors cursor-pointer">
                    <Calendar className="w-5 h-5" />
                 </button>
              </div>

              <div className="flex flex-col gap-4">
                 <ScheduleItem 
                   time="08:00 AM" 
                   title="Matematika X-IPA 1" 
                   type="Live Class" 
                   color="blue" 
                 />
                 <ScheduleItem 
                   time="10:30 AM" 
                   title="Deadline Kuis Biologi" 
                   type="Tugas" 
                   color="red" 
                 />
                 <ScheduleItem 
                   time="13:00 PM" 
                   title="Rapat Guru MGMP" 
                   type="Meeting" 
                   color="amber" 
                 />
                 <ScheduleItem 
                   time="Tomorrow" 
                   title="Rilis Modul Fisika" 
                   type="Materi" 
                   color="green" 
                 />
              </div>

              <button className="mt-6 w-full py-3 rounded-xl border-2 border-[#E1E2EC] text-[#44474E] font-bold hover:bg-[#F3F4F9] transition-colors cursor-pointer">
                 Lihat Semua Jadwal
              </button>
           </div>

           {/* Activity Feed */}
           <div className="bg-white rounded-3xl border border-[#E1E2EC] p-6 shadow-sm overflow-hidden flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6 shrink-0">
                 <h3 className="font-outfit font-black text-xl text-[#1B1B1F]">Feed Aktivitas</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-5 custom-scrollbar">
                 <FeedItem 
                   icon={<FileText className="w-4 h-4" />}
                   title="Aditya P. mengumpulkan tugas"
                   time="10 mnt lalu"
                   desc="Kuis Persamaan Kuadrat (Skor: 90)"
                   color="bg-[#D3E4FF] text-[#005AC1]"
                 />
                 <FeedItem 
                   icon={<MessageSquare className="w-4 h-4" />}
                   title="Komentar baru di Biologi XII"
                   time="1 jam lalu"
                   desc="Siti: 'Bu, materi enzim yang slide 4 kurang jelas...'"
                   color="bg-[#FFD9E2] text-[#8C1D18]"
                 />
                 <FeedItem 
                   icon={<Users className="w-4 h-4" />}
                   title="3 Siswa baru bergabung"
                   time="2 jam lalu"
                   desc="Ke kelas Fisika XI Dasar via kode M3-FIS1"
                   color="bg-[#C0EFEF] text-[#006A6A]"
                 />
                 <FeedItem 
                   icon={<BrainCircuit className="w-4 h-4" />}
                   title="AI Selesai Generate"
                   time="3 jam lalu"
                   desc="15 Soal HOTS Sejarah siap di-review."
                   color="bg-[#EADDFF] text-[#4F378B]"
                 />
                 <FeedItem 
                   icon={<AlertTriangle className="w-4 h-4" />}
                   title="Kecurigaan Terdeteksi"
                   time="4 jam lalu"
                   desc="Budi mencoba ganti tab 3x saat ujian."
                   color="bg-[#FFDF92] text-[#785900]"
                 />
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

// Subcomponents

function StatCard({ icon, label, value, trend, trendUp, color, onClick }: any) {
  const colorMap: any = {
    blue: "bg-[#D3E4FF] text-[#001D35] icon-bg-[#FFFFFF]/50 icon-text-[#005AC1]",
    purple: "bg-[#EADDFF] text-[#21005D] icon-bg-[#FFFFFF]/50 icon-text-[#4F378B]",
    amber: "bg-[#FFDF92] text-[#261A00] icon-bg-[#FFFFFF]/50 icon-text-[#785900]",
    green: "bg-[#C4EED0] text-[#00210E] icon-bg-[#FFFFFF]/50 icon-text-[#146C2E]",
  };
  const theme = colorMap[color];
  const [bgInfo, textInfo, iconBg, iconText] = theme.split(" ");

  return (
    <div 
      onClick={onClick}
      className={`${bgInfo} rounded-3xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-transform ${onClick ? "cursor-pointer hover:shadow-md" : ""}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 ${iconBg.replace('icon-bg-', '')} rounded-xl flex items-center justify-center ${iconText.replace('icon-text-', '')}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`${textInfo} opacity-80 text-sm font-bold uppercase tracking-widest mb-1`}>{label}</p>
        <div className="flex items-end gap-2">
           <h3 className={`text-4xl font-outfit font-black ${textInfo}`}>{value}</h3>
        </div>
        <div className="mt-2 flex items-center gap-1">
           {trendUp ? <TrendingUp className={`w-4 h-4 ${textInfo} opacity-90`} /> : <AlertTriangle className={`w-4 h-4 ${textInfo} opacity-90`} />}
           <span className={`${textInfo} text-xs font-bold`}>{trend}</span>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ type, title, desc }: any) {
  const colors: any = {
    warning: "bg-white border-[#FFDAD6] text-[#BA1A1A] icon-bg-[#FFDAD6]",
    info: "bg-white border-[#D3E4FF] text-[#005AC1] icon-bg-[#D3E4FF]",
    success: "bg-white border-[#C4EED0] text-[#146C2E] icon-bg-[#C4EED0]"
  };
  const theme = colors[type];
  
  return (
    <div className={`border p-3 rounded-2xl flex gap-3 ${theme.split(" ")[0]} ${theme.split(" ")[1]}`}>
       <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${theme.split(" ")[3].replace('icon-bg-', '')}`}>
          {type === 'warning' && <AlertTriangle className={`w-4 h-4 ${theme.split(" ")[2]}`} />}
          {type === 'info' && <BarChart3 className={`w-4 h-4 ${theme.split(" ")[2]}`} />}
          {type === 'success' && <TrendingUp className={`w-4 h-4 ${theme.split(" ")[2]}`} />}
       </div>
       <div>
          <h4 className={`text-sm font-bold ${theme.split(" ")[2]}`}>{title}</h4>
          <p className="text-xs text-[#44474E] mt-0.5 leading-relaxed">{desc}</p>
       </div>
    </div>
  );
}

function ContinueCard({ icon, title, subtitle, onNavigate, color }: any) {
   const colorMap: any = {
      blue: "bg-[#F8F9FF] border-[#D3E4FF] text-[#005AC1] hover:bg-[#D3E4FF]/30",
      purple: "bg-[#FDF8FC] border-[#F2D1E1] text-[#8C1D18] hover:bg-[#F2D1E1]/30",
   };
   const theme = colorMap[color];

   return (
      <div 
         onClick={onNavigate}
         className={`border rounded-2xl p-4 flex gap-4 items-center cursor-pointer transition-colors ${theme}`}
      >
         <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-white shadow-sm border ${theme.split(" ")[1]} ${theme.split(" ")[2]}`}>
            {icon}
         </div>
         <div className="flex-1 truncate">
            <h4 className="font-bold text-[#1B1B1F] text-base truncate">{title}</h4>
            <p className="text-xs text-[#44474E] mt-1 truncate">{subtitle}</p>
         </div>
      </div>
   );
}

function ScheduleItem({ time, title, type, color }: any) {
   const colorMap: any = {
      blue: "bg-[#005AC1] text-white",
      red: "bg-[#BA1A1A] text-white",
      amber: "bg-[#FFBA26] text-[#410002]",
      green: "bg-[#146C2E] text-white"
   };

   return (
      <div className="flex gap-4 items-start pb-4 border-b border-[#E1E2EC]/50 last:border-0 last:pb-0">
         <div className="w-16 shrink-0 text-right">
            <p className="text-sm font-bold text-[#1B1B1F]">{time}</p>
         </div>
         <div className="relative flex-1 pl-4 border-l-2 border-[#E1E2EC]">
            <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${colorMap[color].split(" ")[0]}`}></div>
            <h4 className="font-bold text-[#1B1B1F] text-sm">{title}</h4>
            <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold uppercase tracking-wider ${colorMap[color]}`}>{type}</span>
         </div>
      </div>
   );
}

function FeedItem({ icon, title, time, desc, color }: any) {
   return (
      <div className="flex gap-3">
         <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
            {icon}
         </div>
         <div className="flex-1 border-b border-[#E1E2EC]/50 pb-3">
            <div className="flex justify-between items-start">
               <h4 className="font-bold text-[#1B1B1F] text-sm">{title}</h4>
               <span className="text-[10px] font-bold text-[#74777F] shrink-0 ml-2">{time}</span>
            </div>
            <p className="text-xs text-[#44474E] mt-1 leading-relaxed">{desc}</p>
         </div>
      </div>
   );
}

function ActionBtn({ icon, label }: any) {
   return (
      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#E1E2EC] rounded-lg text-xs font-bold text-[#44474E] hover:bg-[#F3F4F9] transition-colors cursor-pointer">
         {icon} {label}
      </button>
   );
}
