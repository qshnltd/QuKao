"use client";

import { useState, useEffect } from "react";
import * as motion from "motion/react-client";
import { CheckCircle2, XCircle, Search, User, Mail, AlertTriangle, FileText, CheckCircle } from "lucide-react";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminDashboard({ userEmail }: { userEmail: string }) {
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = userEmail === "haibibie26@gmail.com" || userEmail === "hbklrzltd@gmail.com";

  useEffect(() => {
    if (!isAdmin) return;

    const fetchRequests = async () => {
      try {
        const q = query(collection(db, "users"), where("teacherVerificationStatus", "in", ["pending", "verified", "rejected"]));
        const snap = await getDocs(q);
        const users = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActiveRequests(users as any);
      } catch (e) {
        console.error("Gagal mengambil data dari firestore", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [isAdmin]);

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    if (!window.confirm(`Anda yakin ingin mengubah status ini menjadi ${newStatus}?`)) return;
    try {
      await updateDoc(doc(db, "users", userId), {
        teacherVerificationStatus: newStatus
      });
      setActiveRequests(prev => prev.map(req => req.id === userId ? { ...req, teacherVerificationStatus: newStatus } : req));
    } catch (e) {
      alert("Gagal memperbarui status: " + (e as Error).message);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-[#410002] bg-[#FFDAD6] rounded-[36px] mt-8">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-2xl font-black font-outfit">Akses Ditolak</h2>
        <p className="mt-2 text-sm font-medium">Hanya admin sistem yang memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pt-4 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-outfit font-black text-[#1B1B1F] tracking-tight">Admin Dashboard</h2>
        <p className="text-sm font-medium text-[#44474E]">Verifikasi pendaftaran guru dan kelola akses khusus.</p>
      </div>

      <div className="flex flex-col mt-4">
        <div className="py-6 border-b border-[#E1E2EC]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#D3E4FF] text-[#005AC1] rounded-[20px] flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#1B1B1F]">Pengajuan Verifikasi</h3>
              <p className="text-xs text-[#44474E] font-medium">{activeRequests.length} total request ditemukan</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#E1E2EC] border-t-[#005AC1] rounded-full animate-spin"></div>
            </div>
          ) : activeRequests.length === 0 ? (
            <div className="text-center py-12 text-[#44474E]">
              <p className="font-bold text-lg">Belum ada pengajuan</p>
              <p className="text-sm mt-1">Sistem sedang tidak ada antrian verifikasi guru saat ini.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#E1E2EC]/60">
              {activeRequests.map(req => (
                <div key={req.id} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 first:pt-0 last:pb-0">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#EADDFF] flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-[#4F378B]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1B1B1F] text-lg">{req.teacherVerificationData?.name || req.name || "Anonim"}</h4>
                      <p className="text-sm font-medium text-[#44474E] flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3.5 h-3.5" /> {req.email}
                      </p>
                      
                      {/* Detailed info */}
                      {req.teacherVerificationData && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                          <div>
                            <span className="text-xs font-bold text-[#44474E] block uppercase tracking-wider mb-0.5">Status Pendidikan</span>
                            <span className="font-medium text-[#1B1B1F]">{req.teacherVerificationData.status}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#44474E] block uppercase tracking-wider mb-0.5">Pendidikan Terakhir</span>
                            <span className="font-medium text-[#1B1B1F]">{req.teacherVerificationData.education}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-xs font-bold text-[#44474E] block uppercase tracking-wider mb-0.5">Lokasi Mengajar / Praktek</span>
                            <span className="font-medium text-[#1B1B1F]">{req.teacherVerificationData.location}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 shrink-0 self-start md:self-center">
                    {req.teacherVerificationStatus === "pending" && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(req.id, "verified")}
                          className="px-4 py-2.5 rounded-full bg-[#DFF1EB] text-[#006A3F] font-bold text-sm hover:bg-[#C0EFEF] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Terima
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, "rejected")}
                          className="px-4 py-2.5 rounded-full bg-[#FFDAD6] text-[#410002] font-bold text-sm hover:bg-[#FFB4AB] transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" /> Tolak
                        </button>
                      </div>
                    )}
                    {req.teacherVerificationStatus === "verified" && (
                      <div className="flex flex-col gap-2 items-end">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#006A3F] bg-[#DFF1EB] px-4 py-2 rounded-full w-fit">
                          <CheckCircle className="w-4 h-4" /> Telah Diverifikasi
                        </span>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, "rejected")}
                          className="text-xs font-bold text-[#BA1A1A] underline hover:no-underline cursor-pointer"
                        >
                          Cabut Status
                        </button>
                      </div>
                    )}
                    {req.teacherVerificationStatus === "rejected" && (
                      <div className="flex flex-col gap-2 items-end">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#BA1A1A] bg-[#FFDAD6] px-4 py-2 rounded-full w-fit">
                          <XCircle className="w-4 h-4" /> Ditolak
                        </span>
                        <button 
                          onClick={() => handleUpdateStatus(req.id, "pending")}
                          className="text-xs font-bold text-[#005AC1] underline hover:no-underline cursor-pointer"
                        >
                          Review Ulang
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
