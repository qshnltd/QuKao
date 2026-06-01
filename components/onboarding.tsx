"use client";

import { useState } from "react";
import { useAuth } from "./auth-provider";
import * as motion from "motion/react-client";
import { CheckCircle2, ClipboardCopy, Mail } from "lucide-react";

export default function Onboarding() {
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    dob: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedUuid, setGeneratedUuid] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    const { fullName, username, dob, password, confirmPassword } = formData;

    if (!/^[A-Z\s]{10,60}$/.test(fullName)) {
      newErrors.fullName = "10-60 karakter, huruf besar semua, tanpa angka/spesial karakter.";
    }
    if (!/^[a-z0-9]{6,30}$/.test(username)) {
      newErrors.username = "6-30 karakter, huruf kecil dan angka, tanpa spasi/spesial karakter.";
    }
    if (!/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/.test(dob)) {
      newErrors.dob = "Format DD/MM/YYYY yang valid.";
    } else {
      const parts = dob.split('/');
      const year = parseInt(parts[2], 10);
      const currentYear = new Date().getFullYear();
      if (year > currentYear) {
         newErrors.dob = "Tahun lahir tidak boleh lebih dari tahun sekarang.";
      } else if (currentYear - year > 100) {
         newErrors.dob = "Tahun lahir terlalu jauh untuk sistem kita.";
      }
    }
    
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    if (password.length < 6 || password.length > 60 || !hasUpper || !hasLower || !hasSpecial) {
      newErrors.password = "6-60 karakter, min 1 huruf besar, kecil, dan spesial.";
    } else {
       const lowerPwd = password.toLowerCase();
       const namePart = fullName.toLowerCase().replace(/\s/g, '');
       if (namePart && lowerPwd.includes(namePart)) {
          newErrors.password = "Password tidak boleh mengandung nama Anda.";
       }
       if (username && lowerPwd.includes(username)) {
          newErrors.password = "Password tidak boleh mengandung username Anda.";
       }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = () => {
    if (validateStep1()) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const genString = () => Array.from({length: 4}).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
      setGeneratedUuid(`${genString()}-${genString()}-${genString()}-${genString()}`);
      setStep(2);
    }
  };

  const copyUuid = () => {
    navigator.clipboard.writeText(generatedUuid);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleVerifyEmail = async () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);

      const parts = formData.dob.split('/');
      const year = parseInt(parts[2], 10);
      const currentYear = new Date().getFullYear();
      const age = currentYear - year;
      const computedRole = age > 22 ? "guru" : "siswa";

      completeOnboarding({
        name: formData.fullName,
        username: formData.username,
        dob: formData.dob,
        uuid: generatedUuid,
        role: computedRole
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 w-full max-w-sm mx-auto">
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full space-y-6">
          <div>
            <h2 className="text-3xl font-display font-black text-[#1B1B1F] mb-1">Daftar</h2>
          </div>

          <div className="space-y-4">
            <div>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={(e) => {
                  let val = e.target.value.toUpperCase();
                  setFormData({ ...formData, fullName: val });
                }}
                placeholder="NAMA LENGKAP"
                className="w-full p-4 rounded-xl border border-[#C4C6D0] bg-transparent focus:border-[#005AC1] focus:ring-1 focus:ring-[#005AC1] outline-none transition-all placeholder:text-[#44474E]/60 text-[#1B1B1F]"
              />
              {errors.fullName && <p className="text-[#BA1A1A] text-xs mt-1 ml-1">{errors.fullName}</p>}
            </div>

            <div>
              <input
                name="username"
                value={formData.username}
                onChange={(e) => {
                  let val = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                  setFormData({ ...formData, username: val });
                }}
                placeholder="username"
                className="w-full p-4 rounded-xl border border-[#C4C6D0] bg-transparent focus:border-[#005AC1] focus:ring-1 focus:ring-[#005AC1] outline-none transition-all placeholder:text-[#44474E]/60 text-[#1B1B1F]"
              />
              {errors.username && <p className="text-[#BA1A1A] text-xs mt-1 ml-1">{errors.username}</p>}
            </div>

            <div>
              <input
                name="dob"
                value={formData.dob}
                onChange={(e) => {
                  const rawVal = e.target.value;
                  const clean = rawVal.replace(/\D/g, "");
                  let formatted = "";
                  if (clean.length <= 2) {
                    formatted = clean;
                  } else if (clean.length <= 4) {
                    formatted = `${clean.slice(0, 2)}/${clean.slice(2)}`;
                  } else {
                    formatted = `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;
                  }
                  setFormData({ ...formData, dob: formatted });
                  if (errors.dob) {
                    setErrors({ ...errors, dob: "" });
                  }
                }}
                placeholder="Tanggal Lahir (DD/MM/YYYY)"
                maxLength={10}
                className="w-full p-4 rounded-xl border border-[#C4C6D0] bg-transparent focus:border-[#005AC1] focus:ring-1 focus:ring-[#005AC1] outline-none transition-all placeholder:text-[#44474E]/60 text-[#1B1B1F]"
              />
              {errors.dob && <p className="text-[#BA1A1A] text-xs mt-1 ml-1">{errors.dob}</p>}
            </div>

            <div>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-4 rounded-xl border border-[#C4C6D0] bg-transparent focus:border-[#005AC1] focus:ring-1 focus:ring-[#005AC1] outline-none transition-all placeholder:text-[#44474E]/60 text-[#1B1B1F]"
              />
              {errors.password && <p className="text-[#BA1A1A] text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <div>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Konfirmasi Password"
                className="w-full p-4 rounded-xl border border-[#C4C6D0] bg-transparent focus:border-[#005AC1] focus:ring-1 focus:ring-[#005AC1] outline-none transition-all placeholder:text-[#44474E]/60 text-[#1B1B1F]"
              />
              {errors.confirmPassword && <p className="text-[#BA1A1A] text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button
            onClick={handleNextStep1}
            className="w-full bg-[#005AC1] text-white p-4 rounded-[24px] font-bold text-lg hover:bg-[#005AC1]/90 transition-all active:scale-95"
          >
            Lanjutkan
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full space-y-8 flex flex-col items-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1B1B1F] mb-2">Simpan Kode UUID Anda</h2>
            <p className="text-[#44474E] text-sm">Simpan di tempat rahasia. Ini akan digunakan untuk identifikasi khusus nantinya.</p>
          </div>

          <div className="bg-[#DDE2F9] p-6 rounded-[24px] w-full flex flex-col items-center gap-4 relative">
            <p className="font-mono text-xl font-bold text-[#001D35] tracking-widest">{generatedUuid}</p>
            <button 
              onClick={copyUuid}
              className="flex items-center gap-2 text-[#005AC1] font-bold py-2 px-4 rounded-full hover:bg-[#005AC1]/10 transition-colors"
            >
              {isCopied ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <ClipboardCopy className="w-5 h-5" />}
              {isCopied ? "Tersalin!" : "Copy UUID"}
            </button>
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={!isCopied}
            className="w-full bg-[#005AC1] text-white p-4 rounded-[24px] font-bold text-lg disabled:opacity-50 hover:bg-[#005AC1]/90 transition-all active:scale-95"
          >
            Saya Sudah Menyalinnya
          </button>
        </motion.div>
      )}

      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full space-y-8 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-[#DDE2F9] rounded-[32px] flex items-center justify-center text-[#005AC1]">
            <Mail className="w-12 h-12" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1B1B1F] mb-2">Verifikasi Email Anda</h2>
            <p className="text-[#44474E] text-sm leading-relaxed">
              Silakan cek inbox atau folder spam email Anda untuk mengonfirmasi pendaftaran. Setelah verifikasi berhasil, baru Anda dapat menggunakan aplikasi ini.
            </p>
          </div>

          <button
            onClick={handleVerifyEmail}
            disabled={isVerifying}
            className="w-full bg-[#005AC1] text-white p-4 rounded-[24px] font-bold text-lg disabled:opacity-50 hover:bg-[#005AC1]/90 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : "Cek Status Verifikasi"}
          </button>
        </motion.div>
      )}
    </div>
  );
}
