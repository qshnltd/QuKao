"use client";

import { useAuth } from "@/components/auth-provider";
import { LogOut, LayoutDashboard, PlusCircle, Users, BookOpen, Clock, ArrowRight, Zap, User, Search, History, Settings, FileText, CheckCircle, PenTool, Hash, Mail, Gamepad2, CreditCard, GraduationCap, Star, BrainCircuit, ListChecks, Sparkles, ScrollText, Image as ImageIcon, Layers, Music, Volume2, Smile, Mic, Palette, Lock, Trash2, Compass, Send, MessageSquare, Download, Play } from "lucide-react";
import { useState } from "react";
import * as motion from "motion/react-client";
import imageCompression from "browser-image-compression";
import React from "react";

// Local subcomponents and defaults
import { DEFAULT_CLASSES, DEFAULT_SUBMISSIONS } from "./dashboard/defaults";
import StudentLearn from "./dashboard/student-learn";
import StudentClasses from "./dashboard/student-classes";
import StudentHistory from "./dashboard/student-history";
import TeacherCreate from "./dashboard/teacher-create";
import TeacherClasses from "./dashboard/teacher-classes";
import TeacherReports from "./dashboard/teacher-reports";
import AdminDashboard from "./dashboard/admin";
import VerifyTeacher from "./dashboard/verify-teacher";
import TeacherHome from "./dashboard/teacher-home";
import DiscoverTab from "./dashboard/discover";

export default function Dashboard() {
  const { user, userData, role, signOut, updateRole, updateProfileData } = useAuth();
  const [activeTab, setActiveTab] = useState("home");

  // Core Educational Shared States (reactive across tabs & roles!)
  const [classes, setClasses] = useState(DEFAULT_CLASSES);
  const [submissions, setSubmissions] = useState(DEFAULT_SUBMISSIONS);

  if (!user || !role) return null;

  const displayName = userData?.name?.split(" ")[0] || user.displayName?.split(" ")[0] || (role === "guru" ? "Guru" : "Pelajar");
  const userFullEmail = user.email || "siswa@qukao.id";
  const userFullName = userData?.name || user.displayName || "Siswa Cerdas";

  return (
    <div className={`flex flex-col min-h-screen bg-[#F3F4F9]`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F3F4F9]/90 backdrop-blur-xl px-6 lg:px-10 py-4 grid grid-cols-2 lg:grid-cols-3 items-center w-full border-b border-[#E1E2EC]/40">
          {/* Left: Logo */}
          <div className="flex items-center justify-start">
            <h1 className="font-outfit text-4xl font-black tracking-tighter text-[#005AC1] select-none">
              Qu<span className="text-[#001D35]">Kao</span>
            </h1>
          </div>
          
          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center">
            <nav className="flex items-center justify-center gap-2">
              {role === "guru" && (
                <>
                  <DesktopNavItem icon={<LayoutDashboard />} label="Beranda" isActive={activeTab === "home"} onClick={() => setActiveTab("home")} />
                  <DesktopNavItem icon={<Users />} label="Kelas" isActive={activeTab === "classes"} onClick={() => setActiveTab("classes")} />
                  <DesktopNavItem icon={<PlusCircle />} label="Buat" isActive={activeTab === "create"} onClick={() => setActiveTab("create")} />
                  <DesktopNavItem icon={<FileText />} label="Laporan" isActive={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
                  <DesktopNavItem icon={<Compass />} label="Discover" isActive={activeTab === "discover"} onClick={() => setActiveTab("discover")} />
                </>
              )}
              {role === "siswa" && (
                <>
                  <DesktopNavItem icon={<LayoutDashboard />} label="Beranda" isActive={activeTab === "home"} onClick={() => setActiveTab("home")} />
                  <DesktopNavItem icon={<History />} label="Riwayat" isActive={activeTab === "history"} onClick={() => setActiveTab("history")} />
                  <DesktopNavItem icon={<Compass />} label="Discover" isActive={activeTab === "discover"} onClick={() => setActiveTab("discover")} />
                  <DesktopNavItem icon={<Users />} label="Kelas" isActive={activeTab === "classes"} onClick={() => setActiveTab("classes")} />
                  <DesktopNavItem icon={<GraduationCap />} label="Belajar" isActive={activeTab === "explore"} onClick={() => setActiveTab("explore")} />
                </>
              )}
            </nav>
          </div>
          
          {/* Right: Personal Actions */}
          <div className="flex items-center justify-end gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-[#44474E] uppercase tracking-widest">{role}</p>
              <p className="text-sm font-bold">{displayName}</p>
            </div>
            <button 
              onClick={() => setActiveTab("profile")}
              className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center transition-all outline-none border-2 cursor-pointer ${activeTab === "profile" ? "border-[#005AC1] scale-105" : "border-transparent bg-[#DDE2F9] text-[#005AC1] hover:bg-[#D3E4FF]"}`}
              aria-label="Profile"
            >
              {userData?.avatarUrl || user.photoURL ? (
                <img src={userData?.avatarUrl || user.photoURL} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-6 h-6" />
              )}
            </button>
          </div>
        </header>

      {/* Main Content Area */}
      <main className={`flex-1 px-6 lg:px-10 pb-36 flex flex-col gap-6 w-full pt-6`}>
        {activeTab === "home" && (
          role === "guru" ? (
            <TeacherHome 
              name={displayName} 
              activeClassesCount={classes.length} 
              pendingCount={submissions.filter(s => s.status === "perlu_koreksi").length}
              completedCount={submissions.filter(s => s.status === "selesai").length}
              onNavigate={(tab) => setActiveTab(tab)}
              classes={classes}
            />
          ) : (
            <StudentDashboard 
              name={displayName} 
              classes={classes}
              submissions={submissions}
              userEmail={userFullEmail}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )
        )}
        {activeTab === "create" && role === "guru" && (
          <TeacherCreate classes={classes} setClasses={setClasses} onSuccess={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === "classes" && role === "guru" && (
          <TeacherClasses classes={classes} setClasses={setClasses} userName={userFullName} userData={userData} />
        )}
        {activeTab === "reports" && role === "guru" && (
          <TeacherReports submissions={submissions} setSubmissions={setSubmissions} classes={classes} />
        )}
        
        {activeTab === "explore" && role === "siswa" && <StudentLearn />}
        {activeTab === "history" && role === "siswa" && (
          <StudentHistory submissions={submissions} userEmail={userFullEmail} />
        )}
        {activeTab === "classes" && role === "siswa" && (
          <StudentClasses 
            classes={classes} 
            setClasses={setClasses} 
            submissions={submissions} 
            setSubmissions={setSubmissions} 
            userEmail={userFullEmail} 
            userName={userFullName}
          />
        )}
        
        {activeTab === "discover" && <DiscoverTab role={role} />}
        {activeTab === "findcode" && <FindCodeTab />}
        {activeTab === "admin" && <AdminDashboard userEmail={userFullEmail} />}
        {activeTab === "verify-teacher" && <VerifyTeacher updateProfileData={updateProfileData} onBack={() => setActiveTab("profile")} />}
        {activeTab === "profile" && <UserProfile user={user} userData={userData} role={role} onLogout={signOut} updateRole={updateRole} updateProfileData={updateProfileData} onNavigate={(tab) => setActiveTab(tab)} />}
      </main>

      {/* Bottom Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-2xl px-8 pb-8 pt-4 mx-auto z-50 lg:hidden pointer-events-none">
        <nav className="bg-[#FFFFFF]/90 h-[76px] px-6 rounded-[38px] flex items-center justify-between backdrop-blur-xl border border-[#E1E2EC]/40 ring-1 ring-black/5 pointer-events-auto">
            {/* Guru Navigation */}
          {role === "guru" && (
            <>
              <NavItem icon={<LayoutDashboard />} label="Beranda" isActive={activeTab === "home"} onClick={() => setActiveTab("home")} />
              <NavItem icon={<Users />} label="Kelas" isActive={activeTab === "classes"} onClick={() => setActiveTab("classes")} />
              <button 
                onClick={() => setActiveTab("create")}
                className="-mt-14 w-[76px] h-[76px] bg-[#005AC1] rounded-[2rem_1rem_2rem_1rem] flex items-center justify-center text-white border-[6px] border-[#F3F4F9] hover:bg-[#004A9E] hover:rounded-[1rem_2rem_1rem_2rem] transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <PlusCircle className="w-8 h-8" />
              </button>
              <NavItem icon={<FileText />} label="Laporan" isActive={activeTab === "reports"} onClick={() => setActiveTab("reports")} />
              <NavItem icon={<Compass />} label="Discover" isActive={activeTab === "discover"} onClick={() => setActiveTab("discover")} />
            </>
          )}

          {/* Siswa Navigation */}
          {role === "siswa" && (
            <>
              <NavItem icon={<LayoutDashboard />} label="Beranda" isActive={activeTab === "home"} onClick={() => setActiveTab("home")} />
              <NavItem icon={<History />} label="Riwayat" isActive={activeTab === "history"} onClick={() => setActiveTab("history")} />
              <button 
                onClick={() => setActiveTab("discover")}
                className="-mt-14 w-[76px] h-[76px] bg-[#005AC1] rounded-[2rem_1rem_2rem_1rem] flex items-center justify-center text-white border-[6px] border-[#F3F4F9] hover:bg-[#004A9E] hover:rounded-[1rem_2rem_1rem_2rem] transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50  /20"
                title="Discover"
              >
                <Compass className="w-8 h-8" />
              </button>
              <NavItem icon={<Users />} label="Kelas" isActive={activeTab === "classes"} onClick={() => setActiveTab("classes")} />
              <NavItem icon={<GraduationCap />} label="Belajar" isActive={activeTab === "explore"} onClick={() => setActiveTab("explore")} />
            </>
          )}
        </nav>
      </footer>
    </div>
  );
}

function DesktopNavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all cursor-pointer ${isActive ? "bg-[#D3E4FF] text-[#001D35] font-bold" : "text-[#44474E] hover:bg-[#E1E2EC] font-medium"}`}
    >
      {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5", strokeWidth: isActive ? 2.5 : 2 })}
      <span className="text-sm tracking-wide">{label}</span>
    </button>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 w-16 transition-transform cursor-pointer ${isActive ? "scale-105" : ""}`}
    >
      <div className={`w-14 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? "bg-[#D3E4FF] text-[#001D35]" : "text-[#44474E] hover:text-[#001D35]"}`}>
        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-[22px] h-[22px]", strokeWidth: isActive ? 2.5 : 2 })}
      </div>
      <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? "text-[#001D35]" : "text-[#44474E]"}`}>{label}</span>
    </button>
  );
}

{/* Old function removed */}

interface StudentDashboardProps {
  name: string;
  classes: any[];
  submissions: any[];
  userEmail: string;
  onNavigate: (tab: string) => void;
}

function StudentDashboard({ name, classes, submissions, userEmail, onNavigate }: StudentDashboardProps) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 15 ? "Selamat Siang" : hour < 18 ? "Selamat Sore" : "Selamat Malam";

  // Calculate active evaluations waiting for student
  const activeEvaluationsCount = classes.reduce((sum, cls) => {
    const uncompletedQuizzes = cls.quizzes.filter((q: any) => !q.done);
    return sum + uncompletedQuizzes.length;
  }, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Main interactive learn block */}
        <div 
          onClick={() => onNavigate("explore")}
          className="col-span-2 row-span-2 bg-[#EADDFF] rounded-[48px] p-8 flex flex-col justify-between group cursor-pointer transition-transform hover:scale-[0.98] min-h-[220px]"
        >
          <div className="flex justify-between items-start">
            <div>
              <Sparkles className="w-10 h-10 text-[#4F378B] mb-4 fill-[#4F378B]/20" />
              <p className="text-[#4F378B] font-bold text-xs uppercase tracking-widest mb-1">AI Smart Tutor</p>
              <h3 className="text-4xl font-outfit font-black text-[#21005D] leading-tight mb-2 mt-2">Belajar Mandiri</h3>
            </div>
            <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center text-[#4F378B] group-hover:bg-white group-hover:-rotate-45 transition-all">
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[#21005D] text-sm font-medium leading-tight mt-8">Asisten AI cerdas & kartu flashcard interaktif siap membantumu menguasai kuis akademik.</p>
        </div>

        {/* Lanjutkan Belajar */}
        <div 
          onClick={() => onNavigate("classes")}
          className="col-span-2 md:col-span-1 border border-[#E1E2EC] bg-white rounded-[36px] p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#F8F9FF] transition-colors relative"
        >
          <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
          <p className="text-[#44474E] font-bold text-xs uppercase tracking-widest mb-2">Terakhir Dibuka</p>
          <div className="w-14 h-14 bg-[#F3F4F9] rounded-[20px] flex items-center justify-center text-[#1B1B1F] mb-2">
            <BookOpen className="w-6 h-6" />
          </div>
          <p className="text-[#1B1B1F] text-sm font-bold leading-tight">Lanjutkan Materi</p>
        </div>

        {/* Pengumuman */}
        <div 
          onClick={() => onNavigate("home")}
          className="col-span-2 md:col-span-1 border border-[#E1E2EC] bg-white rounded-[36px] p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#F8F9FF] transition-colors"
        >
          <p className="text-[#44474E] font-bold text-xs uppercase tracking-widest mb-2">Informasi</p>
          <div className="w-14 h-14 bg-[#F3F4F9] rounded-[20px] flex items-center justify-center text-[#001D35] mb-2">
            <MessageSquare className="w-6 h-6" />
          </div>
          <p className="text-[#1B1B1F] text-sm font-bold leading-tight">Pengumuman</p>
        </div>

        {/* Active homeworks */}
        <div 
          onClick={() => onNavigate("classes")}
          className="col-span-2 lg:col-span-1 bg-[#FFDF92] rounded-[36px] p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#F2D285] transition-colors"
        >
          <p className="text-[#261A00] font-bold text-xs uppercase tracking-widest mb-2">Evaluasi Aktif</p>
          <p className="text-5xl font-outfit font-black text-[#785900]">{activeEvaluationsCount}</p>
          <p className="text-[#261A00] mt-2 text-sm font-medium leading-tight opacity-90">Kuis menunggu dikerjakan</p>
        </div>

        {/* Classes joined count */}
        <div 
          onClick={() => onNavigate("classes")}
          className="col-span-2 lg:col-span-1 bg-[#C0EFEF] rounded-[36px] p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#B3E2E2] transition-colors relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/30 rounded-full blur-2xl"></div>
          <p className="text-[#002020] font-bold text-xs uppercase tracking-widest mb-2">Kelas Terdaftar</p>
          <p className="text-5xl font-outfit font-black text-[#006A6A]">{classes.length}</p>
          <p className="text-[#002020] mt-2 text-sm font-medium leading-tight opacity-90">Pelajaran aktif</p>
        </div>

        {/* Quick check history banner */}
        <div 
          onClick={() => onNavigate("history")}
          className="col-span-2 lg:col-span-1 bg-[#D3E4FF] rounded-[36px] p-6 px-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#C2D6F5] transition-colors text-center"
        >
          <div className="w-14 h-14 bg-[#005AC1] rounded-[20px] flex items-center justify-center text-white mb-2">
            <History className="w-6 h-6" />
          </div>
          <p className="text-[#001D35] font-bold text-xs uppercase tracking-widest mb-1">Riwayat Kuis</p>
          <h4 className="text-lg font-outfit font-black text-[#005AC1]">Lihat Nilai Akhir</h4>
        </div>
        
        {/* Cari Kode / Discover */}
        <div 
          onClick={() => onNavigate("findcode")}
          className="col-span-2 lg:col-span-1 bg-[#cdcdcd] rounded-[36px] p-6 px-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#E1E2EC] transition-colors text-center "
        >
          <div className="w-14 h-14 bg-[#efefef] rounded-[20px] flex items-center justify-center text-[#1B1B1F] mb-2 ">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-[#44474E] font-bold text-xs uppercase tracking-widest mb-1">Eksplorasi</p>
          <h4 className="text-lg font-outfit font-black text-[#1B1B1F]">Cari Kode</h4>
        </div>
      </div>
    </motion.div>
  );
}

function UserProfile({ user, userData, role, onLogout, updateRole, updateProfileData, onNavigate }: { user: any, userData: any, role: string, onLogout: () => void, updateRole: (role: any) => Promise<void>, updateProfileData: (data: any) => Promise<void>, onNavigate: (tab: string) => void }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [settings, setSettings] = useState({
    music: true,
    sfx: true,
    memes: false,
    readAloud: false,
    theme: "default"
  });

  const [editModal, setEditModal] = useState<{ isOpen: boolean, type: 'name' | 'username' | 'avatarUrl' | 'grade', value: string, file?: File | null }>({ isOpen: false, type: 'name', value: '' });
  const [modalError, setModalError] = useState('');

  const GRADE_OPTIONS = ["Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "University"];

  const handleSwitchMode = async () => {
    setIsUpdating(true);
    await updateRole(role === "guru" ? "siswa" : "guru");
    setIsUpdating(false);
  };

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof settings] }));
  };

  const checkLimits = (type: 'name' | 'username' | 'avatarUrl'): { allowed: boolean, remaining: number, error: string } => {
    const limits = userData?.profileLimits || {};
    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${now.getMonth()}`;
    
    let count = 0;
    
    if (limits[type]?.month === currentMonthStr) {
       count = limits[type]?.count || 0;
    }
    
    let max = 3;
    if (type === 'name') max = 1;
    
    const remaining = max - count;
    const allowed = remaining > 0;
    
    return {
      allowed,
      remaining,
      error: allowed ? '' : `Batas ubah ${type} bulan ini sudah habis.`
    };
  };

  const handleSaveProfile = async () => {
    if (!editModal.value.trim() && editModal.type !== 'avatarUrl') {
       setModalError('Nilai tidak boleh kosong');
       return;
    }

    if (editModal.type !== 'grade') {
        const check = checkLimits(editModal.type);
        if (!check.allowed) {
            setModalError(check.error);
            return;
        }
    }

    setIsUpdating(true);
    try {
       let finalValue = editModal.value.trim();

       if (editModal.type === 'avatarUrl' && editModal.file) {
          const formData = new FormData();
          formData.append("image", editModal.file);
          const response = await fetch("/api/upload/imgbb", {
            method: "POST",
            body: formData
          });
          const result = await response.json();
          if (response.ok && result.url) {
             finalValue = result.url;
          } else {
             setModalError(result.error || "Gagal mengupload gambar.");
             setIsUpdating(false);
             return;
          }
       }

       const limits = userData?.profileLimits || {};
       const now = new Date();
       const currentMonthStr = `${now.getFullYear()}-${now.getMonth()}`;
       
       let updatedLimits = { ...limits };
       
       if (editModal.type !== 'grade') {
           let currentCount = 0;
           if (limits[editModal.type]?.month === currentMonthStr) {
               currentCount = limits[editModal.type]?.count || 0;
           }
           updatedLimits[editModal.type] = {
               month: currentMonthStr,
               count: currentCount + 1
           };
       }
       
       await updateProfileData({
           [editModal.type]: finalValue,
           profileLimits: updatedLimits
       });
       setEditModal({ ...editModal, isOpen: false });
       setModalError('');
    } catch (e) {
       setModalError('Gagal memperbarui profil');
    } finally {
       setIsUpdating(false);
    }
  };

  const defaultAvatar = user.photoURL || null;
  const avatarUrl = userData?.avatarUrl || defaultAvatar;

  const displayName = userData?.name || user.displayName || "Pengguna Qukao";
  const displayUsername = userData?.username || user.email?.split('@')[0] || "user";
  const displayGrade = userData?.grade || (role === "siswa" ? "Belum Diatur" : "Guru");
  const isAdmin = user.email === "haibibie26@gmail.com" || user.email === "hbklrzltd@gmail.com";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pt-4 select-text pb-20">
      <div className="space-y-4 text-center">
        <div className="w-32 h-32 mx-auto rounded-[48px] overflow-hidden border-4 border-[#F3F4F9] flex items-center justify-center bg-[#D3E4FF]  relative">
          {avatarUrl ? (
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User className="w-16 h-16 text-[#005AC1]" />
          )}
        </div>
        <div>
          <h2 className="text-3xl font-outfit font-black text-[#1B1B1F] tracking-tighter">
             {displayName}
          </h2>
          <p className="text-[#44474E] text-base font-medium">
             @{displayUsername}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
             <p className="text-[#44474E] text-sm font-bold uppercase tracking-widest bg-[#E1E2EC] px-4 py-1.5 rounded-full">{role === "siswa" ? "Siswa" : "Guru"}</p>
             {role === "siswa" && (
                <p className="text-[#005AC1] text-sm font-bold uppercase tracking-widest bg-[#D3E4FF] px-4 py-1.5 rounded-full border border-[#005AC1]/20">
                  {displayGrade}
                </p>
             )}
          </div>
        </div>
      </div>

      <div className="space-y-8 mt-8 max-w-lg mx-auto w-full">
        <div>
          <h3 className="text-xl font-outfit font-black text-[#1B1B1F] mb-4 tracking-tight ml-4 mt-2">Dashboard</h3>
          <div className="bg-white border border-[#E1E2EC] rounded-[40px] overflow-hidden flex flex-col">
            {isAdmin && (
              <div 
                onClick={() => onNavigate("admin")}
                className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#F8F9FF] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#BA1A1A] rounded-[20px] flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#410002]">Dashboard Admin</p>
                    <p className="text-sm font-medium text-[#410002] opacity-80">Verifikasi pengajuan guru</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-[#410002]" />
              </div>
            )}
            {role === "guru" && (
              <div 
                onClick={() => {
                  if (userData?.teacherVerificationStatus !== 'verified' && userData?.teacherVerificationStatus !== 'pending') {
                    onNavigate("verify-teacher");
                  }
                }}
                className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#F8F9FF] cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFDF92] rounded-[20px] flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-[#785900]" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#1B1B1F]">Verifikasi Sebagai Guru</p>
                    <p className="text-sm font-medium text-[#44474E]">Akses unggah materi hingga 15MB</p>
                  </div>
                </div>
                {userData?.teacherVerificationStatus === 'verified' ? (
                  <span className="font-black text-[#006A3F] bg-[#DFF1EB] px-4 py-1.5 rounded-full text-xs flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Terverifikasi</span>
                ) : userData?.teacherVerificationStatus === 'pending' ? (
                  <span className="font-black text-[#785900] bg-[#FFDF92]/50 px-4 py-1.5 rounded-full text-xs">Menunggu Review...</span>
                ) : (
                  <ArrowRight className="w-6 h-6 text-[#1B1B1F]" />
                )}
              </div>
            )}
            {role === "siswa" && (
              <div className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#F8F9FF] cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FFDF92] rounded-[20px] flex items-center justify-center">
                    <Star className="w-6 h-6 text-[#785900]" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#1B1B1F]">Point</p>
                    <p className="text-sm font-medium text-[#44474E]">Riwayat penukaran</p>
                  </div>
                </div>
                <span className="font-black text-[#785900] bg-[#FFDF92]/50 px-4 py-1.5 rounded-full text-sm">1,240 pt</span>
              </div>
            )}
            
            <div 
              onClick={handleSwitchMode}
              className={`flex items-center justify-between py-5 px-6 bg-white hover:bg-[#F8F9FF] cursor-pointer transition-colors ${role === "siswa" ? "border-b border-[#E1E2EC]/60" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D3E4FF] rounded-[20px] flex items-center justify-center text-[#005AC1]">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-bold text-[#1B1B1F]">Ganti Mode Akun</p>
                  <p className="text-sm font-medium text-[#44474E]">Ubah ke Mode {role === "siswa" ? "Guru" : "Siswa"}</p>
                </div>
              </div>
              {isUpdating ? (
                 <div className="w-6 h-6 border-4 border-gray-300 border-t-[#005AC1] rounded-full animate-spin" />
              ) : (
                 <ArrowRight className="w-6 h-6 text-[#1B1B1F]" />
              )}
            </div>

            {role === "siswa" && (
              <div className="flex items-center justify-between py-5 px-6 bg-white hover:bg-[#F8F9FF] cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#EADDFF] rounded-[20px] flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-[#4F378B]" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#1B1B1F]">Ruang Nyontek</p>
                    <p className="text-sm font-medium text-[#44474E]">Rp 285.000 / $40 USD</p>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-[#1B1B1F]" />
              </div>
            )}
          </div>
        </div>

        {/* Profil Publik */}
        <div>
          <h3 className="text-xl font-outfit font-black text-[#1B1B1F] ml-4 mb-4 tracking-tight mt-2">Profil Publik</h3>
          <div className="bg-white border border-[#E1E2EC] rounded-[40px] overflow-hidden flex flex-col">
             
             {/* Edit Avatar */}
             <div 
               onClick={() => {
                  setEditModal({ isOpen: true, type: 'avatarUrl', value: avatarUrl || '' });
                  setModalError('');
               }}
               className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#F8F9FF] cursor-pointer transition-colors"
             >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#C0EFEF] rounded-[20px] flex items-center justify-center">
                     <ImageIcon className="w-6 h-6 text-[#006A6A]" />
                   </div>
                   <div>
                     <p className="text-base font-bold text-[#1B1B1F]">Ubah Foto Profil</p>
                     <p className="text-sm font-medium text-[#44474E]">Sesuaikan gambar avatar</p>
                   </div>
                </div>
                <PenTool className="w-5 h-5 text-[#44474E]" />
             </div>

             {/* Edit Name */}
             <div 
               onClick={() => {
                  setEditModal({ isOpen: true, type: 'name', value: displayName });
                  setModalError('');
               }}
               className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#F8F9FF] cursor-pointer transition-colors"
             >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#FFDAD6] rounded-[20px] flex items-center justify-center">
                     <User className="w-6 h-6 text-[#410002]" />
                   </div>
                   <div>
                     <p className="text-base font-bold text-[#1B1B1F]">Ubah Nama</p>
                     <p className="text-sm font-medium text-[#44474E]">Nama yang ditampilkan di profil</p>
                   </div>
                </div>
                <PenTool className="w-5 h-5 text-[#44474E]" />
             </div>

             {/* Edit Username */}
             <div 
               onClick={() => {
                  setEditModal({ isOpen: true, type: 'username', value: displayUsername });
                  setModalError('');
               }}
               className={`flex items-center justify-between py-5 px-6 bg-white hover:bg-[#F8F9FF] cursor-pointer transition-colors ${role === "siswa" ? "border-b border-[#E1E2EC]/60" : ""}`}
             >
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#EADDFF] rounded-[20px] flex items-center justify-center">
                     <Hash className="w-6 h-6 text-[#4F378B]" />
                   </div>
                   <div>
                     <p className="text-base font-bold text-[#1B1B1F]">Ubah Username</p>
                     <p className="text-sm font-medium text-[#44474E]">ID unik (@username)</p>
                   </div>
                </div>
                <PenTool className="w-5 h-5 text-[#44474E]" />
             </div>

             {/* Edit Grade */}
             {role === "siswa" && (
                <div 
                  onClick={() => {
                     setEditModal({ isOpen: true, type: 'grade', value: displayGrade });
                     setModalError('');
                  }}
                  className="flex items-center justify-between py-5 px-6 bg-white hover:bg-[#F8F9FF] cursor-pointer transition-colors"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#005AC1] rounded-[20px] flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-[#1B1B1F]">Ubah Kelas</p>
                        <p className="text-sm font-medium text-[#44474E]">Tingkat pendidikan saat ini</p>
                      </div>
                   </div>
                   <PenTool className="w-5 h-5 text-[#44474E]" />
                </div>
             )}
          </div>
        </div>

        {/* Preferensi */}
        <div>
          <h3 className="text-xl font-outfit font-black text-[#1B1B1F] ml-4 mb-4 tracking-tight mt-2">Preferensi</h3>
          <div className="bg-white border border-[#E1E2EC] rounded-[40px] overflow-hidden flex flex-col">
             {/* Music */}
             <div className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#F8F9FF] transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#D3E4FF] rounded-[20px] flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                     <Music className="w-6 h-6 text-[#005AC1]" />
                   </div>
                   <div>
                     <p className="text-base font-bold text-[#1B1B1F]">Lofi Background Music</p>
                     <p className="text-sm font-medium text-[#44474E]">Bantu kamu lebih fokus</p>
                   </div>
                </div>
                <div onClick={() => toggleSetting('music')} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${settings.music ? "bg-[#005AC1]" : "bg-[#C4C6D0]"}`}>
                   <div className={`bg-white w-6 h-6 rounded-full  transform transition-transform ${settings.music ? "translate-x-6" : ""}`} />
                </div>
             </div>

             {/* SFX */}
             <div className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#F8F9FF] transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#FFDF92] rounded-[20px] flex items-center justify-center">
                     <Volume2 className="w-6 h-6 text-[#785900]" />
                   </div>
                   <div>
                     <p className="text-base font-bold text-[#1B1B1F]">Sound Effect</p>
                     <p className="text-sm font-medium text-[#44474E]">Efek interaksi UI</p>
                   </div>
                </div>
                <div onClick={() => toggleSetting('sfx')} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${settings.sfx ? "bg-[#005AC1]" : "bg-[#C4C6D0]"}`}>
                   <div className={`bg-white w-6 h-6 rounded-full  transform transition-transform ${settings.sfx ? "translate-x-6" : ""}`} />
                </div>
             </div>

             {/* Memes */}
             <div className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#F8F9FF] transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#C0EFEF] rounded-[20px] flex items-center justify-center">
                     <Smile className="w-6 h-6 text-[#006A6A]" />
                   </div>
                   <div>
                     <p className="text-base font-bold text-[#1B1B1F]">Show Memes</p>
                     <p className="text-sm font-medium text-[#44474E]">Meme lucu saat kamu belajar</p>
                   </div>
                </div>
                <div onClick={() => toggleSetting('memes')} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${settings.memes ? "bg-[#005AC1]" : "bg-[#C4C6D0]"}`}>
                   <div className={`bg-white w-6 h-6 rounded-full  transform transition-transform ${settings.memes ? "translate-x-6" : ""}`} />
                </div>
             </div>

             {/* Read Aloud */}
             <div className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#F8F9FF] transition-colors">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-[#FFDAD6] rounded-[20px] flex items-center justify-center">
                     <Mic className="w-6 h-6 text-[#BA1A1A]" />
                   </div>
                   <div>
                     <p className="text-base font-bold text-[#1B1B1F]">Read Aloud</p>
                     <p className="text-sm font-medium text-[#44474E]">Bacakan soal secara otomatis</p>
                   </div>
                </div>
                <div onClick={() => toggleSetting('readAloud')} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${settings.readAloud ? "bg-[#005AC1]" : "bg-[#C4C6D0]"}`}>
                   <div className={`bg-white w-6 h-6 rounded-full  transform transition-transform ${settings.readAloud ? "translate-x-6" : ""}`} />
                </div>
             </div>
             
             {/* Themes */}
             <div className="py-6 px-6 bg-white">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-[#EADDFF] rounded-[20px] flex items-center justify-center">
                     <Palette className="w-6 h-6 text-[#4F378B]" />
                   </div>
                   <div>
                     <p className="text-base font-bold text-[#1B1B1F]">Tema Aplikasi</p>
                     <p className="text-sm font-medium text-[#44474E]">Personalisasi tampilan QuKao</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                   {[
                      { id: "default", name: "Default", color: "bg-[#F3F4F9] text-[#1B1B1F] border border-transparent" },
                      { id: "light", name: "Light Mode", color: "bg-white border border-[#E1E2EC] text-[#1B1B1F]" },
                      { id: "dark", name: "Dark Mode", color: "bg-[#1B1B1F] text-white border border-transparent" },
                      { id: "amoled", name: "Amoled", color: "bg-black text-white border border-[#333]" },
                   ].map(theme => (
                      <button 
                         key={theme.id}
                         onClick={() => setSettings(prev => ({ ...prev, theme: theme.id }))}
                         className={`py-3 rounded-[20px] text-xs font-bold transition-all ${theme.color} ${settings.theme === theme.id ? "ring-2 ring-offset-2 ring-[#005AC1]" : "hover:opacity-80"}`}
                      >
                         {theme.name}
                      </button>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Keamanan & Akun */}
        <div>
          <h3 className="text-xl font-outfit font-black text-[#1B1B1F] ml-4 mb-4 tracking-tight mt-2">Akun & Keamanan</h3>
          <div className="bg-white border border-[#E1E2EC] rounded-[40px] overflow-hidden flex flex-col">
            <div className="flex items-center gap-4 py-5 px-6 border-b border-[#E1E2EC]/60 bg-white">
              <div className="w-12 h-12 bg-[#D3E4FF] rounded-[20px] flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-[#005AC1]" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-[#1B1B1F]">Pusat Email</p>
                <p className="text-sm font-medium text-[#44474E] break-all">{user.email}</p>
              </div>
              {user.emailVerified && (
                 <div className="bg-[#DFF1EB] text-[#006A3F] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 border border-[#006A3F]/20">
                    <CheckCircle className="w-3 h-3" /> Terverifikasi
                 </div>
              )}
            </div>
            
            <div className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#F8F9FF] cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#E1E2EC] rounded-[20px] flex items-center justify-center">
                   <Lock className="w-6 h-6 text-[#44474E]" />
                 </div>
                 <div>
                   <p className="text-base font-bold text-[#1B1B1F]">Perbarui Kata Sandi</p>
                   <p className="text-sm text-[#44474E] font-medium">Ganti password akun Anda</p>
                 </div>
              </div>
              <ArrowRight className="w-6 h-6 text-[#1B1B1F]" />
            </div>
            
            <div onClick={onLogout} className="flex items-center justify-between py-5 px-6 border-b border-[#E1E2EC]/60 bg-white hover:bg-[#FFDAD6] cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#FFDAD6] rounded-[20px] flex items-center justify-center">
                   <LogOut className="w-6 h-6 text-[#BA1A1A]" />
                 </div>
                 <div>
                   <p className="text-base font-bold text-[#BA1A1A]">Keluar Akun</p>
                 </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between py-5 px-6 bg-white hover:bg-[#FFDAD6] cursor-pointer transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#FFDAD6] rounded-[20px] flex items-center justify-center text-[#BA1A1A]">
                   <Trash2 className="w-6 h-6" />
                 </div>
                 <div>
                   <p className="text-base font-bold text-[#BA1A1A]">Hapus Akun Permanen</p>
                   <p className="text-sm text-[#BA1A1A]/80 font-medium">Tindakan ini tidak dapat dibatalkan</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[32px] p-6 max-w-sm w-full mx-auto ">
            <h3 className="text-xl font-bold font-outfit mb-2">Edit {editModal.type === 'name' ? "Nama" : editModal.type === 'username' ? "Username" : editModal.type === 'grade' ? "Kelas" : "Avatar URL"}</h3>
            {editModal.type !== 'grade' && (
               <p className="text-sm text-[#44474E] mb-4">Sisa percobaan bulan ini: <span className="font-bold">{checkLimits(editModal.type).remaining}</span></p>
            )}
            
            {editModal.type === 'grade' ? (
               <select 
                 value={editModal.value}
                 onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                 className="w-full px-4 py-3 bg-[#F3F4F9] border border-[#E1E2EC] rounded-[16px] outline-none focus:border-[#005AC1] focus:ring-2 focus:ring-[#005AC1]/20 font-medium h-[52px] mb-2 appearance-none"
               >
                 <option value="" disabled>Pilih Kelas</option>
                 {GRADE_OPTIONS.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                 ))}
               </select>
            ) : editModal.type === 'avatarUrl' ? (
               <div className="mb-2">
                 {editModal.file || editModal.value ? (
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-[#F3F4F9] mb-4">
                       <img src={editModal.file ? URL.createObjectURL(editModal.file) : editModal.value} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                 ) : null}
                 <input 
                   type="file" 
                   accept="image/*"
                   onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          try {
                             const options = {
                               maxSizeMB: 0.7,
                               maxWidthOrHeight: 1024,
                               useWebWorker: true,
                               fileType: "image/webp"
                             };
                             const compressedFile = await imageCompression(file, options);
                             setEditModal({ ...editModal, file: compressedFile as File });
                          } catch (error) {
                             console.error("Compression error:", error);
                             setEditModal({ ...editModal, file });
                          }
                      }
                   }}
                   className="w-full text-sm text-[#44474E] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#DDE2F9] file:text-[#005AC1] hover:file:bg-[#D3E4FF] cursor-pointer"
                 />
               </div>
            ) : (
               <input 
                 type="text" 
                 placeholder={`Masukkan ${editModal.type} baru`}
                 value={editModal.value}
                 onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                 className="w-full px-4 py-3 bg-[#F3F4F9] border border-[#E1E2EC] rounded-[16px] outline-none focus:border-[#005AC1] focus:ring-2 focus:ring-[#005AC1]/20 font-medium mb-2"
               />
            )}
            
            {modalError && <p className="text-sm text-[#BA1A1A] mb-4 font-medium">{modalError}</p>}
            
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={() => setEditModal({ ...editModal, isOpen: false })} className="px-5 py-2.5 rounded-full font-bold text-[#44474E] hover:bg-[#F3F4F9]">Batal</button>
              <button 
                onClick={handleSaveProfile} 
                disabled={isUpdating}
                className="px-5 py-2.5 rounded-full font-bold bg-[#005AC1] text-white hover:bg-[#004A9E] disabled:opacity-50"
              >
                {isUpdating ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}

function FindCodeTab() {
  const [searchCode, setSearchCode] = useState("");
  const [searchState, setSearchState] = useState<"idle" | "loading" | "result">("idle");

  const handleSearchClass = () => {
    if (!searchCode.trim()) return;
    setSearchState("loading");
    setTimeout(() => {
      setSearchState("result");
      setTimeout(() => setSearchState("idle"), 3000);
    }, 1500);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-10 pt-12 pb-24 items-center min-h-[80vh]">
      <div className="w-full max-w-xl flex flex-col gap-8 items-center text-center">
        <div>
          <h2 className="text-3xl font-outfit font-black text-[#1B1B1F]">Cari Kode</h2>
        </div>
        
        <div className="w-full bg-white border border-[#E1E2EC] rounded-full flex items-center pl-6 pr-2 py-2 focus-within:border-[#005AC1] focus-within:ring-4 focus-within:ring-[#005AC1]/10 transition-all">
          <input 
            type="text"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleSearchClass()}
            placeholder="KETIK KODE..." 
            className="flex-1 bg-transparent border-none outline-none text-xl font-bold tracking-[0.2em] text-[#1B1B1F] min-w-0 mr-4 placeholder:font-normal placeholder:tracking-normal uppercase placeholder:text-base placeholder:text-[#8D9199]"
            autoFocus
          />
          <button 
            onClick={handleSearchClass}
            disabled={searchState === "loading" || !searchCode.trim()}
            className="bg-[#1B1B1F] hover:bg-[#44474E] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all shrink-0 disabled:opacity-50 flex items-center gap-2"
          >
            {searchState === "loading" ? "Mencari..." : "Temukan"}
          </button>
        </div>

        {searchState === "result" && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-[#FFDAD6] border border-[#FFB4AB] rounded-3xl p-6 flex items-center gap-4 text-left">
            <div className="w-12 h-12 bg-[#BA1A1A] rounded-full flex items-center justify-center text-white shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold text-[#410002]">Kode &quot;{searchCode}&quot; tidak valid</p>
              <p className="text-sm text-[#93000A]">Pastikan kode ditulis dengan benar tanpa ada typo.</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="w-full max-w-xl flex flex-col gap-3">
        <h3 className="text-lg font-outfit font-black text-[#1B1B1F] px-2 mb-2">Tugas yang Diberikan</h3>
        
        {/* Activity 1 */}
        <div className="w-full bg-white border border-[#E1E2EC] rounded-[28px] p-5 flex items-center gap-4 hover:border-[#005AC1] hover:shadow-sm cursor-pointer transition-all group">
          <div className="w-[52px] h-[52px] bg-[#DDE2F9] text-[#005AC1] rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-[#1B1B1F] truncate group-hover:text-[#005AC1] transition-colors">Quiz Matematika - Limit & Turunan</h4>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5 text-[#BA1A1A]" />
              <p className="text-xs font-bold text-[#BA1A1A]">Batas: Hari ini, 23:59</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#F3F4F9] text-[#44474E] flex items-center justify-center shrink-0 group-hover:bg-[#005AC1] group-hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* Activity 2 */}
        <div className="w-full bg-white border border-[#E1E2EC] rounded-[28px] p-5 flex items-center gap-4 hover:border-[#005AC1] hover:shadow-sm cursor-pointer transition-all group">
          <div className="w-[52px] h-[52px] bg-[#F1F0F4] text-[#44474E] rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 group-hover:bg-[#DDE2F9] group-hover:text-[#005AC1]">
            <Layers className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-[#1B1B1F] truncate group-hover:text-[#005AC1] transition-colors">Materi Biologi - Sel Genetik</h4>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5 text-[#44474E]" />
              <p className="text-xs font-medium text-[#44474E]">Batas: Besok, 12:00</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#F3F4F9] text-[#44474E] flex items-center justify-center shrink-0 group-hover:bg-[#005AC1] group-hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Deleted DiscoverTab implementation
