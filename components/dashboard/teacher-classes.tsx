"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { PlusCircle, Search, Users, FileText, Send, MessageSquare, BookOpen, Clock, Download, Plus, ArrowLeft, Trash2, CheckCircle2, MoreVertical, ArrowUp, ArrowDown, Edit2, Archive, Pin } from "lucide-react";
import { ClassItem, MaterialItem, QuizItem, DiscussionItem } from "./types";

interface TeacherClassesProps {
  classes: ClassItem[];
  setClasses: React.Dispatch<React.SetStateAction<ClassItem[]>>;
  userName: string;
  userData?: any;
}

export default function TeacherClasses({ classes, setClasses, userName, userData }: TeacherClassesProps) {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('bottom');

  const [deleteModal, setDeleteModal] = useState<{ id: string; type: 'material' | 'quiz' | 'class'; title: string } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [editModal, setEditModal] = useState<{ id: string; type: 'material' | 'quiz' | 'class'; title: string } | null>(null);
  const [editNewTitle, setEditNewTitle] = useState("");

  // New Class Form States
  const [newClassName, setNewClassName] = useState("");
  const [newClassSubject, setNewClassSubject] = useState("");
  const [newClassCode, setNewClassCode] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(0);

  // Material states
  const [activeSubTab, setActiveSubTab] = useState<"materi" | "quiz" | "diskusi">("materi");
  const [newMaterialTitle, setNewMaterialTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [announceInput, setAnnounceInput] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  // QuKao Word States
  const [isWordEditorOpen, setIsWordEditorOpen] = useState(false);
  const [wordTitle, setWordTitle] = useState("");
  const [wordContent, setWordContent] = useState("");

  const activeClass = classes.find(c => c.id === selectedClassId);

  const THEMES = [
    { bg: "bg-[#D3E4FF]", textColor: "text-[#001D35]", icon: "Hash" },
    { bg: "bg-[#FFDAD6]", textColor: "text-[#410002]", icon: "Zap" },
    { bg: "bg-[#C0EFEF]", textColor: "text-[#002020]", icon: "BookOpen" },
    { bg: "bg-[#FFE082]", textColor: "text-[#261A00]", icon: "GraduationCap" }
  ];

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim() || !newClassCode.trim()) return;

    const theme = THEMES[selectedTheme];
    const newClass: ClassItem = {
      id: `cls-${Date.now()}`,
      name: `${newClassName} ${newClassSubject}`,
      code: newClassCode.trim().toUpperCase(),
      teacher: userName,
      bg: theme.bg,
      textColor: theme.textColor,
      icon: theme.icon,
      students: 0,
      materials: [],
      quizzes: [],
      discussions: [
        { id: `disc-init`, sender: "Sistem Guru", text: "Kelas baru berhasil diluncurkan! Selamat mengajar.", date: "Baru saja" }
      ]
    };

    setClasses(prev => [newClass, ...prev]);
    setIsCreatingClass(false);
    setNewClassName("");
    setNewClassCode("");
    alert(`Kelas "${newClassName}" berhasil dibuat!`);
  };

  const handleUploadMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle.trim() || !selectedClassId) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Append material
          const newMaterial: MaterialItem = {
            id: `mat-${Date.now()}`,
            title: newMaterialTitle.trim() + ".pdf",
            size: "1.5 MB"
          };

          setClasses(prevClasses => prevClasses.map(cls => {
            if (cls.id === selectedClassId) {
              return {
                ...cls,
                materials: [...cls.materials, newMaterial]
              };
            }
            return cls;
          }));

          setIsUploading(false);
          setNewMaterialTitle("");
          alert("Materi berhasil diunggah dan dirilis ke siswa!");
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleSendDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceInput.trim() || !selectedClassId) return;

    setClasses(prev => prev.map(cls => {
      if (cls.id === selectedClassId) {
        return {
          ...cls,
          discussions: [
            ...cls.discussions,
            {
              id: `disc-${Date.now()}`,
              sender: `${userName} (Guru)`,
              text: announceInput.trim(),
              date: "Baru saja"
            }
          ]
        };
      }
      return cls;
    }));

    setAnnounceInput("");
  };

  const triggerDelete = (id: string, type: 'material' | 'quiz' | 'class', title: string) => {
    setDeleteConfirmText("");
    setDeleteModal({ id, type, title });
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    if (deleteConfirmText !== deleteModal.title) {
      alert("Nama teks tidak cocok!");
      return;
    }
    
    if (deleteModal.type === 'class') {
      setClasses(prev => prev.filter(c => c.id !== deleteModal.id));
      setSelectedClassId(null);
    } else if (deleteModal.type === 'material') {
      setClasses(prev => prev.map(cls => {
        if (cls.id === selectedClassId) return { ...cls, materials: cls.materials.filter(m => m.id !== deleteModal.id) };
        return cls;
      }));
    } else if (deleteModal.type === 'quiz') {
      setClasses(prev => prev.map(cls => {
        if (cls.id === selectedClassId) return { ...cls, quizzes: cls.quizzes.filter(q => q.id !== deleteModal.id) };
        return cls;
      }));
    }
    setDeleteModal(null);
    setDeleteConfirmText("");
  };

  const triggerEdit = (id: string, type: 'material' | 'quiz' | 'class', title: string) => {
    setEditNewTitle(title);
    setEditModal({ id, type, title });
  };

  const confirmEdit = () => {
    if (!editModal || !editNewTitle.trim()) return;
    if (editModal.type === 'class') {
      setClasses(prev => prev.map(c => c.id === editModal.id ? { ...c, name: editNewTitle } : c));
    } else if (editModal.type === 'material') {
      setClasses(prev => prev.map(cls => {
        if (cls.id === selectedClassId) return { ...cls, materials: cls.materials.map(m => m.id === editModal.id ? { ...m, title: editNewTitle } : m) };
        return cls;
      }));
    } else if (editModal.type === 'quiz') {
      setClasses(prev => prev.map(cls => {
        if (cls.id === selectedClassId) return { ...cls, quizzes: cls.quizzes.map(q => q.id === editModal.id ? { ...q, title: editNewTitle } : q) };
        return cls;
      }));
    }
    setEditModal(null);
    setEditNewTitle("");
  };

  const handleMove = (id: string, type: 'material' | 'quiz', direction: 'up' | 'down') => {
    setClasses(prev => prev.map(cls => {
      if (cls.id !== selectedClassId) return cls;
      const list = type === 'material' ? [...cls.materials] : [...cls.quizzes];
      const index = list.findIndex(item => item.id === id);
      if (index === -1) return cls;
      if (direction === 'up' && index > 0) {
        [list[index - 1], list[index]] = [list[index], list[index - 1]];
      } else if (direction === 'down' && index < list.length - 1) {
        [list[index + 1], list[index]] = [list[index], list[index + 1]];
      }
      return type === 'material' ? { ...cls, materials: list as MaterialItem[] } : { ...cls, quizzes: list as QuizItem[] };
    }));
  };

  const handlePin = (id: string, type: 'class') => {
    setClasses(prev => prev.map(c => c.id === id ? { ...c, isPinned: !c.isPinned } : c));
  };
  
  const handleArchive = (id: string, type: 'class') => {
    // Return early if this class is currently active
    if (id === selectedClassId) {
      setSelectedClassId(null);
    }
    setClasses(prev => prev.map(c => c.id === id ? { ...c, isArchived: !c.isArchived } : c));
  };

  const renderDropdown = (id: string, type: 'material' | 'quiz' | 'class', title: string, isPinned?: boolean, isArchived?: boolean) => {
    const dropId = `${type}-${id}`;
    const isOpen = openDropdownId === dropId;

    return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          setDropdownPosition(spaceBelow < 280 ? 'top' : 'bottom');
          setOpenDropdownId(prev => prev === dropId ? null : dropId);
        }}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#44474E] hover:bg-[#E1E2EC] transition-colors cursor-pointer shrink-0"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className={`absolute right-0 ${dropdownPosition === 'top' ? 'bottom-12' : 'top-12'} w-48 bg-white border border-[#E1E2EC] rounded-[24px] shadow-lg z-50 overflow-hidden flex flex-col py-2`} onClick={(e) => e.stopPropagation()}>
          {(type === 'material' || type === 'quiz') && (
            <>
              <button className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#1B1B1F] hover:bg-[#F3F4F9] text-left cursor-pointer transition-colors" onClick={() => { setOpenDropdownId(null); handleMove(id, type, 'up'); }}>
                <ArrowUp className="w-4 h-4 text-[#44474E]" /> Pindah Atas
              </button>
              <button className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#1B1B1F] hover:bg-[#F3F4F9] text-left cursor-pointer transition-colors" onClick={() => { setOpenDropdownId(null); handleMove(id, type, 'down'); }}>
                <ArrowDown className="w-4 h-4 text-[#44474E]" /> Pindah Bawah
              </button>
            </>
          )}
          <button className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#1B1B1F] hover:bg-[#F3F4F9] text-left cursor-pointer transition-colors" onClick={() => { setOpenDropdownId(null); triggerEdit(id, type, title); }}>
            <Edit2 className="w-4 h-4 text-[#44474E]" /> Edit
          </button>
          
          {type === 'class' && (
            <>
              <button className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#1B1B1F] hover:bg-[#F3F4F9] text-left cursor-pointer transition-colors" onClick={() => { setOpenDropdownId(null); handlePin(id, 'class'); }}>
                <Pin className="w-4 h-4 text-[#44474E]" /> {isPinned ? "Unpin" : "Pin"}
              </button>
              <button className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#1B1B1F] hover:bg-[#F3F4F9] text-left cursor-pointer transition-colors" onClick={() => { setOpenDropdownId(null); handleArchive(id, 'class'); }}>
                <Archive className="w-4 h-4 text-[#44474E]" /> {isArchived ? "Batal Arsipkan" : "Arsipkan"}
              </button>
            </>
          )}

          <div className="h-[1px] bg-[#E1E2EC] my-1 pt-0 pb-0" />
          <button 
            onClick={() => {
              setOpenDropdownId(null);
              triggerDelete(id, type, title);
            }} 
            className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#BA1A1A] hover:bg-[#FFDAD6]/50 text-left cursor-pointer transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Hapus
          </button>
        </div>
      )}
    </div>
  )};

  if (selectedClassId && activeClass) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pt-4 pb-20" onClick={() => setOpenDropdownId(null)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedClassId(null)}
              className="w-10 h-10 rounded-full bg-[#E1E2EC] text-[#1B1B1F] flex items-center justify-center font-bold cursor-pointer hover:opacity-85 "
              title="Kembali"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-3xl font-outfit font-black text-[#1B1B1F] tracking-tight">{activeClass.name}</h2>
              <p className="text-xs text-[#44474E] font-medium">Kode Kelas: {activeClass.code} • {activeClass.students} Siswa terdaftar</p>
            </div>
          </div>
          
          <div className="hidden sm:flex">
            {renderDropdown(activeClass.id, 'class', activeClass.name, activeClass.isPinned, activeClass.isArchived)}
          </div>
        </div>

        {/* Subtabs */}
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

        <div className="mt-8 flex flex-col gap-8 min-h-[300px]">
          {/* MATERI INTERACTIVE UPLOAD (TEACHER) */}
          {activeSubTab === "materi" && (
            <div className="flex flex-col gap-6">
              {userData?.teacherVerificationStatus === 'verified' ? (
                <div className="bg-[#DFF1EB] p-4 rounded-[20px] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-[#006A3F] text-sm">Akses Cloud Guru Premium</h4>
                    <p className="text-xs text-[#006A3F] mt-0.5 font-medium">Batas unggahan kelas (1.2 MB / 15.0 MB digunakan)</p>
                  </div>
                  <div className="w-1/3 h-2 bg-[#006A3F]/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#006A3F] w-[8%] rounded-full"></div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FFF8F6] p-4 rounded-[20px] flex items-center justify-between border border-[#FFDAD6]">
                  <div>
                    <h4 className="font-bold text-[#410002] text-sm">Mode Mengajar Terbatas</h4>
                    <p className="text-xs text-[#410002] mt-0.5 font-medium">Lakukan verifikasi akun di tab Profil untuk menaikkan limit kelas hingga 15MB.</p>
                  </div>
                </div>
              )}

              {/* Dynamic Material Upload Action */}
              {userData?.teacherVerificationStatus === 'verified' ? (
                <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-end pb-6 border-b border-[#E1E2EC] w-full">
                  <button 
                    onClick={() => setIsWordEditorOpen(true)}
                    className="px-6 py-4 bg-white border border-[#E1E2EC] hover:bg-[#F3F4F9] text-[#1B1B1F] text-sm font-bold rounded-full cursor-pointer transition-all whitespace-nowrap shadow-sm text-center"
                  >
                     📝 Buat QuKao Word
                  </button>
                  <label className="px-6 py-4 bg-[#005AC1] hover:bg-[#004A9E] text-white text-sm font-black rounded-full cursor-pointer disabled:bg-[#E1E2EC] disabled:text-[#44474E] transition-all whitespace-nowrap text-center flex items-center justify-center gap-2">
                    <Download className="w-4 h-4 rotate-180" /> Unggah File Beragam
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                         if (e.target.files && e.target.files[0]) {
                            setIsUploading(true);
                            setUploadProgress(0);
                            const fileName = e.target.files[0].name;
                            const interval = setInterval(() => {
                              setUploadProgress(prev => {
                                if (prev >= 100) {
                                  clearInterval(interval);
                                  const newMaterial: MaterialItem = {
                                    id: `mat-${Date.now()}`,
                                    title: fileName,
                                    size: "File Cloud"
                                  };
                                  setClasses(prevClasses => prevClasses.map(cls => cls.id === selectedClassId ? { ...cls, materials: [...cls.materials, newMaterial] } : cls));
                                  setIsUploading(false);
                                  alert("File berhasil diunggah dan dibagikan!");
                                  return 100;
                                }
                                return prev + 25;
                              });
                            }, 200);
                         }
                      }}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-end pb-6 border-b border-[#E1E2EC]">
                  <button 
                    onClick={() => setIsWordEditorOpen(true)}
                    className="px-6 py-4 bg-[#005AC1] border border-[#005AC1] hover:bg-[#004A9E] text-white text-sm font-bold rounded-full cursor-pointer transition-all whitespace-nowrap shadow-sm text-center w-full sm:w-auto"
                  >
                     📝 Buat Dokumen Teks (QuKao Word)
                  </button>
                </div>
              )}
              {isUploading && (
                 <div className="w-full bg-[#E1E2EC] h-2 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#005AC1] transition-all" style={{ width: `${uploadProgress}%` }}></div>
                 </div>
              )}

              {/* Materials list */}
              {activeClass.materials.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-base font-bold text-[#44474E]">Belum ada materi terunggah</p>
                  <p className="text-sm text-[#44474E] mt-1">Silakan ketik nama materi dan klik &quot;Rilis PDF Baru&quot; di atas untuk memulai pelajaran baru.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[#E1E2EC]/60 md:px-2">
                  {activeClass.materials.map(mat => {
                    const lTitle = mat.title.toLowerCase();
                    let fileType = "DOCX";
                    let bgCol = "bg-[#D3E4FF]";
                    let tCol = "text-[#005AC1]";
                    if (lTitle.endsWith('.pdf')) { fileType = "PDF"; bgCol = "bg-[#FFDAD6]"; tCol = "text-[#BA1A1A]"; }
                    else if (lTitle.endsWith('.mp4') || lTitle.endsWith('.mov')) { fileType = "VIDEO"; bgCol = "bg-[#EADDFF]"; tCol = "text-[#4F378B]"; }
                    else if (lTitle.endsWith('.jpg') || lTitle.endsWith('.png')) { fileType = "FOTO"; bgCol = "bg-[#C4EED0]"; tCol = "text-[#146C2E]"; }

                    return (
                    <div key={mat.id} className={`py-5 flex items-center justify-between group first:pt-0 last:pb-0 relative ${openDropdownId === 'material-' + mat.id ? 'z-50' : 'z-10'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xs shrink-0 select-none ${bgCol} ${tCol}`}>
                          {fileType}
                        </div>
                        <div>
                          <p className="text-base font-black text-[#1B1B1F] group-hover:text-[#005AC1] transition-colors">{mat.title}</p>
                          <p className="text-sm text-[#44474E] font-medium mt-0.5">{mat.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden sm:flex text-xs font-bold text-[#006A6A] bg-[#C0EFEF]/50 px-4 py-2 rounded-full items-center gap-1.5 select-none shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-[#006A6A]" /> Rilis Aktif
                        </span>
                        {renderDropdown(mat.id, 'material', mat.title)}
                      </div>
                    </div>
                  )})}
                </div>
              )}
            </div>
          )}

          {/* QUIZZES ACTION (TEACHER) */}
          {activeSubTab === "quiz" && (
            <div className="flex flex-col gap-6">
              {activeClass.quizzes.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-base font-bold text-[#44474E]">Belum ada ujian dirilis</p>
                  <p className="text-sm text-[#44474E] mt-1">Silakan buat kuis, ujian, atau evaluasi baru melalui tab &quot;Buat&quot; di navigasi utama.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-[#E1E2EC]/60 md:px-2">
                  {activeClass.quizzes.map(quiz => (
                    <div key={quiz.id} className={`py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0 group relative ${openDropdownId === 'quiz-' + quiz.id ? 'z-50' : 'z-10'}`}>
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-[#FFE082] text-[#785900] flex items-center justify-center shrink-0">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-base font-black text-[#1B1B1F] group-hover:text-[#005AC1] transition-colors">{quiz.title}</p>
                          <p className="text-sm text-[#44474E] font-medium mt-0.5">Durasi pengerjaan {quiz.duration} • {quiz.questions.length} Butir Pertanyaan • Tipe: {quiz.type === 'quiz' ? 'Kuis' : 'Ujian Akbar'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        {quiz.isDraft ? (
                          <span className="hidden sm:flex text-xs font-bold bg-[#E1E2EC] text-[#44474E] px-4 py-2 rounded-full select-none">
                            Draf Ujian
                          </span>
                        ) : (
                          <span className="hidden sm:flex text-xs font-bold bg-[#EADDFF] text-[#4F378B] px-4 py-2 rounded-full select-none">
                            Rilis Aktif
                          </span>
                        )}
                        {renderDropdown(quiz.id, 'quiz', quiz.title)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DISKUSI ACTION (TEACHER) */}
          {activeSubTab === "diskusi" && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-6 bg-transparent">
                {/* Chat window - transparent elegant layout */}
                <div className="h-[480px] overflow-y-auto pr-2 space-y-4 flex flex-col-reverse divide-y divide-transparent">
                  <div className="space-y-4">
                    {activeClass.discussions.map(disc => (
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
                    value={announceInput}
                    onChange={(e) => setAnnounceInput(e.target.value)}
                    placeholder="Sampaikan pengumuman atau instruksi baru..."
                    className="flex-1 bg-white border border-[#E1E2EC] rounded-full px-6 py-4 text-sm font-bold outline-none text-[#1B1B1F] focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 transition-all placeholder:font-normal placeholder:text-[#8D9199]"
                  />
                  <button
                    type="submit"
                    disabled={!announceInput.trim()}
                    className="w-14 h-14 rounded-full bg-[#005AC1] hover:bg-[#004A9E] text-white flex items-center justify-center transition-all disabled:bg-[#E1E2EC] disabled:text-[#44474E] cursor-pointer shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pt-4 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        
        <button
          onClick={() => setIsCreatingClass(true)}
          className="py-3 px-6 rounded-[24px] bg-[#005AC1] hover:bg-[#004A9E] text-white text-xs font-black cursor-pointer  active:scale-95 transition-transform flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Buat Kelas Baru
        </button>
      </div>

      {isCreatingClass && (
        <form onSubmit={handleCreateClass} className="p-6 bg-white border border-[#E1E2EC] rounded-[36px] flex flex-col gap-6 ">
          <h3 className="text-lg font-bold font-outfit">Luncurkan Kelas Baru</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#44474E]">Nama Kelas (Contoh: X IPA 2)</label>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Contoh: Kelas XII IPA 2"
                className="p-3.5 bg-slate-50 border rounded-2xl text-xs font-bold focus:border-[#005AC1]"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#44474E]">Mata Pelajaran</label>
              <input
                type="text"
                value={newClassSubject}
                onChange={(e) => setNewClassSubject(e.target.value)}
                placeholder="Contoh: Matematika"
                className="p-3.5 bg-slate-50 border rounded-2xl text-xs font-bold focus:border-[#005AC1]"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#44474E]">Kode Kelas Unik</label>
              <input
                type="text"
                value={newClassCode}
                onChange={(e) => setNewClassCode(e.target.value)}
                placeholder="Contoh: M3-KIM2"
                className="p-3.5 bg-slate-50 border rounded-2xl text-xs font-bold uppercase focus:border-[#005AC1]"
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-t pt-4">
            <button
              type="button"
              onClick={() => setIsCreatingClass(false)}
              className="py-3 px-5 rounded-2xl bg-[#E1E2EC] text-[#1B1B1F] text-xs font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-[#005AC1] text-white text-xs font-black"
            >
              Komit Buat Kelas
            </button>
          </div>
        </form>
      )}

      {/* Classes list */}
      <div className="flex items-center gap-4 mt-4 border-b border-[#E1E2EC] pb-2">
        <button
          onClick={() => setShowArchived(false)}
          className={`text-sm font-bold pb-2 border-b-2 transition-colors ${!showArchived ? "border-[#005AC1] text-[#005AC1]" : "border-transparent text-[#44474E] hover:text-[#1B1B1F]"}`}
        >
          Kelas Aktif
        </button>
        <button
          onClick={() => setShowArchived(true)}
          className={`text-sm font-bold pb-2 border-b-2 transition-colors ${showArchived ? "border-[#005AC1] text-[#005AC1]" : "border-transparent text-[#44474E] hover:text-[#1B1B1F]"}`}
        >
          Arsip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {classes
          .filter(c => (showArchived ? c.isArchived : !c.isArchived))
          .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
          .map(cls => (
          <div
            key={cls.id}
            onClick={() => setSelectedClassId(cls.id)}
            className={`${cls.bg} min-h-[160px] p-6 rounded-[36px] transition-transform cursor-pointer flex flex-col justify-between group relative ${openDropdownId === 'class-' + cls.id ? 'z-50' : 'z-10 hover:scale-[0.98]'}`}
          >
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold">
                <Users className="w-5 h-5 text-[#005AC1]" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase bg-white/40 px-3 py-1 rounded-full">{cls.code}</span>
                {renderDropdown(cls.id, 'class', cls.name, cls.isPinned, cls.isArchived)}
              </div>
            </div>

            <div>
              <h3 className={`text-2xl font-outfit font-black ${cls.textColor} line-clamp-1`}>{cls.name}</h3>
              <p className="text-xs font-black opacity-80 mt-1 text-[#44474E]">{cls.students} Siswa Terdaftar</p>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-4">
            <h3 className="text-xl font-bold font-outfit text-[#1B1B1F]">Konfirmasi Hapus</h3>
            <p className="text-sm text-[#44474E]">
              Ketik <span className="font-bold text-[#BA1A1A] select-all">{deleteModal.title}</span> untuk menghapus permanen.
            </p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={e => setDeleteConfirmText(e.target.value)}
              placeholder="Ketik nama di sini..."
              className="p-3.5 bg-slate-50 border border-[#E1E2EC] rounded-2xl text-sm font-bold focus:border-[#BA1A1A] outline-none"
            />
            <div className="flex justify-end gap-3 mt-2">
              <button onClick={() => setDeleteModal(null)} className="px-5 py-3 text-sm font-bold text-[#44474E] hover:bg-[#F3F4F9] rounded-full transition-colors cursor-pointer">
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deleteConfirmText !== deleteModal.title}
                className="px-5 py-3 text-sm font-bold text-white bg-[#BA1A1A] hover:bg-[#93000A] disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-4">
            <h3 className="text-xl font-bold font-outfit text-[#1B1B1F]">Edit</h3>
            <input
              type="text"
              value={editNewTitle}
              onChange={e => setEditNewTitle(e.target.value)}
              placeholder="Nama Baru"
              className="p-3.5 bg-slate-50 border border-[#E1E2EC] rounded-2xl text-sm font-bold focus:border-[#005AC1] outline-none"
            />
            <div className="flex justify-end gap-3 mt-2">
              <button onClick={() => setEditModal(null)} className="px-5 py-3 text-sm font-bold text-[#44474E] hover:bg-[#F3F4F9] rounded-full transition-colors cursor-pointer">
                Batal
              </button>
              <button 
                onClick={confirmEdit}
                disabled={!editNewTitle.trim()}
                className="px-5 py-3 text-sm font-bold text-white bg-[#005AC1] hover:bg-[#004799] disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QuKao Word Modal */}
      {isWordEditorOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex flex-col p-4 sm:p-10 justify-center">
          <div className="bg-[#F8F9FF] rounded-[32px] w-full max-w-5xl mx-auto shadow-2xl flex flex-col h-[85vh] overflow-hidden border border-[#E1E2EC]">
            {/* Editor Topbar */}
            <div className="bg-[#005AC1] px-6 py-4 flex items-center justify-between text-white shrink-0">
               <div className="flex items-center gap-4">
                 <div className="bg-white/20 p-2 rounded-xl text-white">
                   <FileText className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-xl leading-tight">QuKao Word Editor</h3>
                   <p className="text-white/80 text-xs font-medium">Batas ketikan maksimal ~1MB</p>
                 </div>
               </div>
               <button onClick={() => setIsWordEditorOpen(false)} className="bg-white/20 hover:bg-white/30 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                  &times;
               </button>
            </div>
            
            {/* Toolbar Docs Style */}
            <div className="bg-white py-3 px-6 border-b border-[#E1E2EC] flex items-center gap-4 shrink-0 shadow-sm overflow-x-auto custom-scrollbar">
                <input 
                  type="text" 
                  value={wordTitle} 
                  onChange={(e) => setWordTitle(e.target.value)}
                  placeholder="Beri Judul Dokumen..." 
                  className="bg-[#F3F4F9] px-4 py-2 rounded-lg outline-none font-bold text-sm min-w-[200px]"
                />
                
                <div className="w-[1px] h-6 bg-[#E1E2EC]"></div>
                
                <div className="flex items-center gap-1">
                   <button className="w-8 h-8 rounded hover:bg-[#F3F4F9] font-serif font-bold text-lg flex items-center justify-center cursor-pointer">B</button>
                   <button className="w-8 h-8 rounded hover:bg-[#F3F4F9] font-serif italic text-lg flex items-center justify-center cursor-pointer">I</button>
                   <button className="w-8 h-8 rounded hover:bg-[#F3F4F9] font-serif underline text-lg flex items-center justify-center cursor-pointer">U</button>
                </div>

                <div className="w-[1px] h-6 bg-[#E1E2EC]"></div>
                <div className="text-xs text-[#8D9199] font-medium whitespace-nowrap">Format lain sedang dikembangkan</div>
            </div>

            {/* Editing Area */}
            <div className="flex-1 overflow-y-auto bg-[#F8F9FF] p-6 lg:p-10 flex justify-center">
                <div className="bg-white border border-[#E1E2EC] shadow-sm max-w-3xl w-full min-h-[600px] h-full p-10 lg:p-14">
                    <textarea 
                       value={wordContent}
                       onChange={(e) => {
                         if (e.target.value.length < 1000000) { // Limit roughly to 1MB text
                           setWordContent(e.target.value);
                         } else {
                           alert("Peringatan: Tersisa sedikit ruang, bataas 1MB hampir tercapai.");
                         }
                       }}
                       placeholder="Mulai menulis catatan atau materi Anda di sini..."
                       className="w-full h-full resize-none outline-none text-[#1B1B1F] text-base leading-relaxed font-sans"
                    />
                </div>
            </div>
            
            {/* Action Bottom */}
            <div className="bg-white border-t border-[#E1E2EC] p-4 flex justify-end gap-3 shrink-0">
               <button onClick={() => setIsWordEditorOpen(false)} className="px-6 py-2 rounded-full font-bold text-[#44474E] hover:bg-[#F3F4F9] transition-colors cursor-pointer">Batal</button>
               <button 
                  onClick={() => {
                     if(!wordTitle) { alert("Judul dokumen wajib diisi!"); return; }
                     const htmlItem: MaterialItem = {
                        id: `mat-${Date.now()}`,
                        title: `${wordTitle}.docx`,
                        size: `${(wordContent.length / 1024).toFixed(1)} KB`
                     };
                     setClasses(prev => prev.map(c => c.id === selectedClassId ? { ...c, materials: [...c.materials, htmlItem] } : c));
                     setIsWordEditorOpen(false);
                     setWordTitle("");
                     setWordContent("");
                     alert("Dokumen berhasil disimpan dan dirilis ke kelas!");
                  }}
                  className="px-6 py-2 rounded-full font-black text-white bg-[#005AC1] hover:bg-[#004A9E] transition-colors cursor-pointer"
               >
                  Simpan & Rilis Dokumen
               </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
