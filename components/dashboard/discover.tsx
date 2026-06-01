"use client";

import React, { useState } from "react";
import * as motion from "motion/react-client";
import { 
  Compass, Search, Filter, TrendingUp, Star, Bookmark, Download, 
  BookOpen, FileText, LayoutTemplate, Layers, ChevronRight, Sparkles, Heart
} from "lucide-react";

const CATEGORIES = ["Semua", "Matematika", "Sains", "Bahasa", "Sejarah", "Teknologi", "Seni"];
const LEVELS = ["Semua Tingkat", "SD", "SMP", "SMA", "Universitas"];

const MOCK_TEMPLATES = [
  { id: 1, title: "Modul Lengkap Aljabar Kelas 10", author: "Budi Santoso", type: "Materi", rating: 4.8, downloads: "12k", category: "Matematika", color: "blue" },
  { id: 2, title: "Ujian Tengah Semester - Biologi", author: "Siti Rahma", type: "Kuis", rating: 4.9, downloads: "8.5k", category: "Sains", color: "green" },
  { id: 3, title: "Template Laporan Praktikum Kimia", author: "Andi Wijaya", type: "Template", rating: 4.7, downloads: "5.2k", category: "Sains", color: "amber" },
  { id: 4, title: "Kuis Interaktif Sejarah Dunia", author: "Dina Mariana", type: "Kuis", rating: 4.9, downloads: "15k", category: "Sejarah", color: "purple" },
  { id: 5, title: "Materi Pengantar Pemrograman", author: "Farhan Ali", type: "Materi", rating: 4.6, downloads: "9k", category: "Teknologi", color: "blue" },
  { id: 6, title: "Vocabulary Builder - English", author: "Grace Tan", type: "Kuis", rating: 4.8, downloads: "22k", category: "Bahasa", color: "purple" },
];

export default function DiscoverTab({ role = "siswa" }: { role?: string }) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = MOCK_TEMPLATES.filter(t => 
    (activeCategory === "Semua" || t.category === activeCategory) &&
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      {/* Header & Search */}
      <div className="bg-gradient-to-r from-[#001D35] to-[#00397A] rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 flex flex-col gap-6 max-w-3xl">
          <div>
            <h1 className="text-3xl sm:text-4xl font-outfit font-black text-white tracking-tight mb-2">
               {role === "guru" ? "Bank Soal & Template" : "Eksplorasi Resource Pembelajaran"}
            </h1>
            <p className="text-white/80 text-lg">
               {role === "guru" 
                  ? "Cari ribuan template soal siap pakai, formulir, dan struktur kuis yang bisa langsung digunakan." 
                  : "Temukan ribuan materi edukasi interaktif dan catatan belajar dari berbagai penjuru Nusantara."}
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-4 py-3 flex items-center gap-3 focus-within:bg-white/20 transition-colors">
              <Search className="w-5 h-5 text-white/70" />
              <input 
                type="text" 
                placeholder="Cari topik, soal, atau nama pembuat..." 
                className="bg-transparent border-none outline-none text-white placeholder-white/50 w-full font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="bg-white text-[#001D35] px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-[#F3F4F9] transition-colors cursor-pointer shrink-0">
               <Filter className="w-5 h-5" /> <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="bg-gradient-to-r from-[#FDF8FC] to-[#F3F4F9] rounded-2xl border border-[#E1E2EC] p-1 flex flex-col sm:flex-row items-stretch shadow-sm">
         <div className="bg-[#EADDFF] rounded-xl flex items-center justify-center p-6 shrink-0 text-[#21005D]">
            <Sparkles className="w-8 h-8" />
         </div>
         <div className="p-5 flex-1 flex flex-col justify-center">
            <h3 className="font-bold text-[#1B1B1F] flex items-center gap-2">
               Rekomendasi Pintar AI <span className="bg-[#FFBA26] text-[#410002] px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Baru</span>
            </h3>
            <p className="text-sm text-[#44474E] mt-1 pr-4">Berdasarkan aktivitas kelas Anda, kami merekomendasikan kumpulan soal &quot;Sistem Persamaan Linear AI-Generated&quot; yang memiliki win-rate 85%.</p>
         </div>
         <div className="p-4 flex items-center border-t sm:border-t-0 sm:border-l border-[#E1E2EC]/50 shrink-0">
            <button className="w-full sm:w-auto bg-[#005AC1] hover:bg-[#004799] text-white px-5 py-2 rounded-xl font-bold text-sm transition-colors cursor-pointer">
               Lihat Rekomendasi
            </button>
         </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
         {role === "guru" ? (
             <>
                 <button onClick={() => setActiveCategory("Semua")} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all cursor-pointer ${activeCategory === "Semua" ? "bg-[#005AC1] text-white shadow-md" : "bg-white border border-[#E1E2EC] text-[#44474E] hover:bg-[#F8F9FF]"}`}>Semua</button>
                 <button onClick={() => setActiveCategory("Template Quiz")} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all cursor-pointer ${activeCategory === "Template Quiz" ? "bg-[#005AC1] text-white shadow-md" : "bg-white border border-[#E1E2EC] text-[#44474E] hover:bg-[#F8F9FF]"}`}>Template Quiz</button>
                 <button onClick={() => setActiveCategory("Template Form")} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all cursor-pointer ${activeCategory === "Template Form" ? "bg-[#005AC1] text-white shadow-md" : "bg-white border border-[#E1E2EC] text-[#44474E] hover:bg-[#F8F9FF]"}`}>Template Form</button>
                 <button onClick={() => setActiveCategory("Template Ujian")} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all cursor-pointer ${activeCategory === "Template Ujian" ? "bg-[#005AC1] text-white shadow-md" : "bg-white border border-[#E1E2EC] text-[#44474E] hover:bg-[#F8F9FF]"}`}>Template Ujian</button>
                 <button onClick={() => setActiveCategory("Materi")} className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all cursor-pointer ${activeCategory === "Materi" ? "bg-[#005AC1] text-white shadow-md" : "bg-white border border-[#E1E2EC] text-[#44474E] hover:bg-[#F8F9FF]"}`}>Materi Singkat</button>
             </>
         ) : CATEGORIES.map(cat => (
           <button 
             key={cat}
             onClick={() => setActiveCategory(cat)}
             className={`px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all cursor-pointer ${
               activeCategory === cat 
                 ? "bg-[#005AC1] text-white shadow-md" 
                 : "bg-white border border-[#E1E2EC] text-[#44474E] hover:bg-[#F8F9FF]"
             }`}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* Content Grid */}
      <div>
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-outfit font-black text-[#1B1B1F] flex items-center gap-2">
               <TrendingUp className="w-5 h-5 text-[#BA1A1A]" /> Sedang Trending
            </h2>
            <button className="text-[#005AC1] font-bold text-sm flex items-center gap-1 hover:underline cursor-pointer">
               Lihat Semua <ChevronRight className="w-4 h-4" />
            </button>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {role === "guru" ? (
                <>
                   <TemplateCard title="Bank Soal Aljabar SMP" author="Tim Kurikulum QuKao" type="Template Quiz" rating={4.9} downloads="1.2k" category="Template Quiz" color="purple" />
                   <TemplateCard title="Form Evaluasi Pembelajaran" author="Nurul Huda" type="Template Form" rating={4.8} downloads="3k" category="Template Form" color="amber" />
                   <TemplateCard title="Ujian Tengah Semester K-13 Biasa" author="Dinas Pendidikan" type="Template Ujian" rating={4.5} downloads="5.6k" category="Template Ujian" color="blue" />
                   <TemplateCard title="Struktur Quiz Sejarah Kemerdekaan" author="Ahmad" type="Template Quiz" rating={4.6} downloads="900" category="Template Quiz" color="green" />
                </>
             ) : filteredTemplates.map(template => (
                <TemplateCard key={template.id} {...template} />
             ))}
             {filteredTemplates.length === 0 && role !== "guru" && (
                <div className="col-span-full py-12 text-center text-[#44474E]">
                   Pencarian &quot;{searchQuery}&quot; tidak ditemukan pada kategori {activeCategory}.
                </div>
             )}
         </div>
      </div>
    </motion.div>
  );
}

function TemplateCard({ title, author, type, rating, downloads, color }: any) {
   const colorMap: any = {
      blue: "bg-[#D3E4FF] text-[#005AC1]",
      green: "bg-[#C4EED0] text-[#146C2E]",
      amber: "bg-[#FFDF92] text-[#785900]",
      purple: "bg-[#EADDFF] text-[#4F378B]"
   };

   const iconMap: any = {
      "Materi": <BookOpen className="w-5 h-5" />,
      "Kuis": <HelpCircleIcon className="w-5 h-5" />,
      "Template": <LayoutTemplate className="w-5 h-5" />
   };

   // Placeholder for missing icon in lucide-react import
   const IconComponent = type === 'Kuis' ? FileText : (type === 'Materi' ? BookOpen : LayoutTemplate);

   return (
      <div className="bg-white border border-[#E1E2EC] rounded-3xl p-5 hover:shadow-lg transition-all hover:-translate-y-1 group flex flex-col">
         <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
               <IconComponent className="w-6 h-6" />
            </div>
            <button className="w-8 h-8 rounded-full border border-[#E1E2EC] flex items-center justify-center text-[#44474E] hover:bg-[#FFDAD6] hover:text-[#BA1A1A] hover:border-[#FFDAD6] transition-colors cursor-pointer">
               <Heart className="w-4 h-4" />
            </button>
         </div>
         
         <div className="mb-4 flex-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#74777F]">{type}</span>
            <h3 className="font-bold text-[#1B1B1F] text-lg leading-tight mt-1 line-clamp-2 group-hover:text-[#005AC1] transition-colors">{title}</h3>
            <p className="text-sm text-[#44474E] mt-2 flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-[#E1E2EC] flex items-center justify-center text-[10px] font-black">{author.charAt(0)}</span> {author}</p>
         </div>

         <div className="flex justify-between items-center pt-4 border-t border-[#E1E2EC]/50">
            <div className="flex items-center gap-4 text-xs font-bold text-[#44474E]">
               <span className="flex items-center gap-1"><Star className="w-4 h-4 text-[#FFBA26] fill-[#FFBA26]" /> {rating}</span>
               <span className="flex items-center gap-1"><Download className="w-4 h-4" /> {downloads}</span>
            </div>
            <button className="bg-[#F3F4F9] text-[#001D35] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#D3E4FF] transition-colors cursor-pointer">
               Gunakan
            </button>
         </div>
      </div>
   );
}

// Temporary fallback
function HelpCircleIcon(props: any) {
  return <FileText {...props} />;
}
