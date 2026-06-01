"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Sparkles, MailOpen, AlertTriangle } from "lucide-react";

export default function ViewOtpPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [otpData, setOtpData] = useState<{ otp: string; email: string } | null>(null);
  const [copied, setCopied] = useState(false);
  
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!token || fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetchOtp() {
      try {
        const res = await fetch(`/api/otp/view?token=${token}`);
        const data = await res.json();
        
        if (data.success) {
          setOtpData({ otp: data.otp, email: data.email });
        } else {
          setError(data.error || "Tautan keamanan tidak valid");
        }
      } catch (err: any) {
        setError("Koneksi bermasalah. Coba lagi nanti.");
      } finally {
        setLoading(false);
      }
    }

    fetchOtp();
    return () => {};
  }, [token]);

  const handleCopy = () => {
    if (otpData?.otp) {
      navigator.clipboard.writeText(otpData.otp);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFE] flex flex-col text-[#1A1C1E] px-6 sm:px-12 pb-20 pt-16 selection:bg-[#D3E3FD] selection:text-[#041E49] relative overflow-hidden">
      
      {/* Organic Background Blobs (M3 Expressive) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D3E3FD] rounded-full mix-blend-multiply filter blur-[120px] opacity-40 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#E8DEF8] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between z-10">
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-tighter text-[#0A56D1]">QuKao</span>
         </motion.div>
      </header>

      {/* Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto z-10 mt-12 sm:mt-0">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              className="flex flex-col items-center gap-6"
            >
              {/* Custom Organic Spinner */}
              <div className="relative w-24 h-24">
                <svg className="animate-spin w-full h-full text-[#0A56D1]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" strokeWidth="6" stroke="currentColor" strokeDasharray="200" strokeDashoffset="100" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[#44474E] text-lg font-medium tracking-wide">Membuka sesi aman...</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              className="flex flex-col items-center text-center max-w-lg"
            >
              <div className="w-24 h-24 mb-6 bg-[#FFDAD6] rounded-[2rem] flex items-center justify-center rotate-3 transform-gpu">
                <AlertTriangle className="w-12 h-12 text-[#BA1A1A]" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl font-semibold mb-4 text-[#BA1A1A] tracking-tight text-balance">Sesi tidak dapat dilanjutkan</h1>
              <p className="text-lg text-[#44474E] leading-relaxed mb-8">{error}</p>
            </motion.div>
          ) : otpData ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center w-full max-w-2xl"
            >
              <div className="mb-8 p-4 bg-[#D3E3FD] rounded-full inline-flex animate-bounce-slow">
                 <MailOpen className="w-8 h-8 text-[#041E49]" />
              </div>

              <h1 className="text-5xl sm:text-6xl font-medium tracking-tight mb-4 text-[#1A1C1E]">
                Akses Diberikan
              </h1>
              
              <p className="text-lg sm:text-xl text-[#44474E] mb-12 max-w-lg leading-relaxed text-balance">
                Ini adalah kode aman untuk akun <span className="text-[#041E49] font-medium block mt-1">{otpData.email}</span>
              </p>

              {/* Expressive Button / Container (Not a regular card) */}
              <button 
                onClick={handleCopy}
                className="w-full relative group outline-none focus-visible:ring-4 focus-visible:ring-[#0A56D1]/20 rounded-[3rem] transition-all duration-300 transform-gpu hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className={`absolute inset-0 rounded-[3rem] transition-colors duration-500 ease-out ${copied ? 'bg-[#C4EED0]' : 'bg-[#F2F4F7] group-hover:bg-[#E8EDF4]'}`} />
                
                <div className="relative z-10 flex flex-col items-center justify-center p-10 sm:p-14">
                   <div className="flex gap-2 sm:gap-4 mb-8">
                     {otpData.otp.split('').map((num, i) => (
                       <motion.span 
                         key={i}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.05 }}
                         className={`text-5xl sm:text-7xl md:text-8xl font-black font-mono tracking-tighter transition-colors ${copied ? 'text-[#072711]' : 'text-[#041E49]'}`}
                       >
                         {num}
                       </motion.span>
                     ))}
                   </div>
                   
                   <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${copied ? 'bg-[#072711] text-[#C4EED0]' : 'bg-[#0A56D1] text-white shadow-lg shadow-[#0A56D1]/20'}`}>
                      {copied ? (
                        <>
                          <Check className="w-5 h-5" /> Tersalin ke Papan Klip
                        </>
                      ) : (
                        <>
                          <Copy className="w-5 h-5" /> Salin Kode ke Papan Klip
                        </>
                      )}
                   </div>
                </div>
              </button>

              <div className="mt-12 flex items-center gap-3 text-[#44474E] bg-[#F2F4F7] px-6 py-4 rounded-3xl">
                <Sparkles className="w-5 h-5 text-[#0A56D1]" />
                <p className="text-sm text-left">Kode ini berlaku independen selama 10 menit, dan otomatis hangus bila telah digunakan masuk.</p>
              </div>

            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
