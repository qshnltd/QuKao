"use client";

import { useState } from "react";
import * as motion from "motion/react-client";
import { ArrowLeft } from "lucide-react";

export default function VerifyTeacher({ updateProfileData, onBack }: { updateProfileData: (data: any) => Promise<void>, onBack: () => void }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    status: 'Kuliah',
    education: 'SMA/SMK',
    location: ''
  });

  const handleVerifyTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    await updateProfileData({
      teacherVerificationStatus: 'pending',
      teacherVerificationData: {
        ...formData,
        submittedAt: new Date().toISOString()
      }
    });
    setIsUpdating(false);
    onBack();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 pt-4 pb-20 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 border-b border-[#E1E2EC] pb-6">
        <button
          onClick={onBack}
          className="w-12 h-12 rounded-full bg-[#E1E2EC] text-[#1B1B1F] flex items-center justify-center font-bold hover:opacity-85"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-outfit font-black text-[#1B1B1F] tracking-tight">Verifikasi Guru</h2>
          <p className="text-sm font-medium text-[#44474E] mt-1">Dapatkan akses premium berbagi dokumen file untuk kelas.</p>
        </div>
      </div>

      <div className="mt-4">
        <form onSubmit={handleVerifyTeacher} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-[#1B1B1F] mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              required
              placeholder="Sesuai kartu identitas pengajar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-4 bg-[#F8F9FF] border border-[#E1E2EC] rounded-[20px] outline-none focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 text-sm font-medium transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1B1B1F] mb-2">Status Pendidikan Saat Ini</label>
            <div className="relative">
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-6 py-4 bg-[#F8F9FF] border border-[#E1E2EC] rounded-[20px] outline-none focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 text-sm font-medium appearance-none transition-all dropdown-custom"
              >
                <option value="Kuliah">Sedang Kuliah</option>
                <option value="Tidak Kuliah">Tidak Kuliah</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1B1B1F] mb-2">Pendidikan Terakhir</label>
            <div className="relative">
              <select 
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="w-full px-6 py-4 bg-[#F8F9FF] border border-[#E1E2EC] rounded-[20px] outline-none focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 text-sm font-medium appearance-none transition-all dropdown-custom"
              >
                <option value="SMA/SMK">SMA / SMK / Sederajat</option>
                <option value="D3">Diploma (D3)</option>
                <option value="S1/D4">Sarjana (S1) / Sarjana Terapan (D4)</option>
                <option value="S2">Magister (S2)</option>
                <option value="S3">Doktoral (S3)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#1B1B1F] mb-2">Lokasi Praktek Mengajar</label>
            <input 
              type="text" 
              required
              placeholder="Misal: SMAN 1 Jakarta"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-6 py-4 bg-[#F8F9FF] border border-[#E1E2EC] rounded-[20px] outline-none focus:border-[#005AC1] focus:ring-4 focus:ring-[#005AC1]/10 text-sm font-medium transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={isUpdating}
            className="mt-6 w-full py-5 rounded-full font-bold bg-[#005AC1] text-white hover:bg-[#004A9E] disabled:opacity-50 disabled:bg-[#E1E2EC] disabled:text-[#44474E] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isUpdating ? "MENGIRIMKAN..." : "AJUKAN VERIFIKASI SEKARANG"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
