"use client";

import { useAuth } from "@/components/auth-provider";
import Dashboard from "@/components/dashboard";
import Onboarding from "@/components/onboarding";
import { useState, useEffect, useRef, useCallback } from "react";
import * as motion from "motion/react-client";
import { Mail, Lock, Key, ArrowRight, Loader2, RefreshCcw } from "lucide-react";

export default function Home() {
  const { user, role, loading, needsOnboarding, needsEmailVerification, needsOtp, markOtpVerified, signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithCustomTokenVal, resetPassword, resendVerification, signOut } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resentVerification, setResentVerification] = useState(false);
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [otp, setOtp] = useState("");
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const hasSentOtpInit = useRef(false);

  const handleSendOtpInternal = useCallback(async () => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const email = user?.email;
      if (!email) throw new Error("Email tidak ditemukan");

      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Server mengalami kendala saat memproses koneksi.");
      }

      if (res.ok && data.success) {
        setOtpSent(true);
        if (data.token) {
          setOtpToken(data.token);
        }
        setResendCooldown(30);
      } else {
        throw new Error(data.error || "Gagal mengirim OTP");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [user]);

  useEffect(() => {
     if (user && needsOtp && !hasSentOtpInit.current) {
        hasSentOtpInit.current = true;
        handleSendOtpInternal();
     }
  }, [user, needsOtp, handleSendOtpInternal]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(c => c - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      const newOtp = [...otpArray];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtpArray(newOtp);
      setOtp(newOtp.join(""));
      const nextIndex = Math.min(pasted.length, 5);
      const el = document.getElementById(`otp-${nextIndex}`);
      if (el) el.focus();
      return;
    }
    
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpArray];
    newOtp[index] = value;
    setOtpArray(newOtp);
    setOtp(newOtp.join(""));

    if (value !== "" && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      if (el) el.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otpArray[index] === "" && index > 0) {
        const el = document.getElementById(`otp-${index - 1}`);
        if (el) el.focus();
    }
  };

const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/network-request-failed' || err.message?.includes('network-request-failed')) {
        setErrorMsg("Koneksi gagal. Browser memblokir pop-up/login. Silakan buka aplikasi ini di Tab Baru (ikon di kanan atas) atau matikan pemblokir iklan.");
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg("Pop-up login ditutup sebelum selesai dimuat.");
      } else {
        setErrorMsg(err.message || "Gagal masuk menggunakan Google");
      }
      setIsSubmitting(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Email dan password harus diisi");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await signInWithEmail(email, password);
    } catch (err: any) {
      if (err.code === 'auth/network-request-failed' || err.message?.includes('network-request-failed')) {
        setErrorMsg("Koneksi gagal. Silakan buka aplikasi ini di Tab Baru.");
      } else {
        setErrorMsg("Email atau password yang Anda masukkan salah.");
      }
      setIsSubmitting(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Email dan password harus diisi");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await signUpWithEmail(email, password);
    } catch (err: any) {
      if (err.code === 'auth/network-request-failed' || err.message?.includes('network-request-failed')) {
        setErrorMsg("Koneksi gagal. Silakan buka aplikasi ini di Tab Baru.");
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg("Email ini sudah terdaftar. Silakan masuk.");
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg("Kata sandi terlalu pendek (minimal 6 karakter).");
      } else {
        setErrorMsg(err.message || "Gagal mendaftar akun baru.");
      }
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg("Masukkan email Anda terlebih dahulu untuk reset password");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal mengirim link reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setErrorMsg("Masukkan kode OTP");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);
    try {
       const resp = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email, otp, token: otpToken })
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || "Kode OTP salah atau kedaluwarsa");
      }
      markOtpVerified();
    } catch (err: any) {
       setErrorMsg(err.message);
       setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F9]">
        <div className="w-12 h-12 border-4 border-[#005AC1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (needsOtp && user) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center p-6 bg-[#F3F4F9]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm flex flex-col items-center gap-6 text-center"
        >
          <h2 className="text-3xl font-display font-black text-[#1B1B1F]">Verifikasi OTP</h2>
          <p className="text-[#44474E] text-sm">
            Kode 6 digit telah dikirim ke email <b>{user.email}</b>.
          </p>
          
          <form onSubmit={handleVerifyOtp} className="w-full space-y-4 mt-4">
             <div className="flex justify-between gap-2 w-full mb-4">
               {otpArray.map((digit, index) => (
                 <input
                   key={index}
                   id={`otp-${index}`}
                   type="text"
                   inputMode="numeric"
                   maxLength={6}
                   value={digit}
                   onChange={(e) => handleOtpChange(index, e.target.value)}
                   onKeyDown={(e) => handleOtpKeyDown(index, e)}
                   className="w-12 h-14 text-center rounded-xl border border-[#C4C6D0] bg-[#F8F9FF] focus:bg-white focus:border-[#005AC1] focus:ring-1 focus:ring-[#005AC1] outline-none text-[#1B1B1F] text-xl font-bold"
                 />
               ))}
             </div>

             {errorMsg && <p className="text-[#BA1A1A] text-xs font-medium bg-[#FFDAD6] p-2 rounded-md">{errorMsg}</p>}

             <button
                type="submit"
                disabled={isSubmitting || otp.length < 6}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#005AC1] text-white hover:bg-[#004A9E] transition-all active:scale-[0.98] disabled:opacity-50"
             >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                <span className="font-bold text-sm">Verifikasi</span>
             </button>
             
             <button
               type="button"
               disabled={resendCooldown > 0 || isSubmitting}
               onClick={handleSendOtpInternal}
               className="text-[#44474E] text-xs font-bold hover:text-[#1B1B1F] transition-all underline mt-4 block mx-auto disabled:opacity-50 disabled:no-underline"
             >
               {resendCooldown > 0 ? `Kirim ulang OTP dalam ${resendCooldown} detik` : 'Kirim Ulang OTP'}
             </button>
          </form>
        </motion.div>
      </main>
    );
  }

  if (needsEmailVerification) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center p-6 bg-[#F3F4F9]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm flex flex-col items-center gap-6 text-center"
        >
          <div className="w-20 h-20 bg-[#D3E3FD] text-[#005AC1] rounded-full flex items-center justify-center mb-2">
            <Mail className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-black text-[#1B1B1F]">Cek Email Anda</h2>
          <p className="text-[#44474E] text-sm">
            Kami telah mengirimkan tautan verifikasi ke email Anda. Silakan verifikasi untuk melanjutkan ke halaman utama.
          </p>
          
          <div className="w-full space-y-3 mt-4">
            <button
              onClick={async () => {
                try {
                  setIsSubmitting(true);
                  await resendVerification();
                  setResentVerification(true);
                } catch (err: any) {
                  setErrorMsg(err.message);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting || resentVerification}
              className="w-full flex items-center justify-center gap-2 p-4 bg-[#005AC1] text-white rounded-xl font-bold hover:bg-[#004A9E] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <RefreshCcw className="w-5 h-5" />}
              {resentVerification ? "Email Terkirim" : "Kirim Ulang Email"}
            </button>
            <button
              onClick={signOut}
              className="w-full p-4 border border-[#C4C6D0] text-[#1B1B1F] rounded-xl font-bold hover:bg-[#E1E2EC] transition-colors"
            >
              Kembali ke Login
            </button>
            {errorMsg && <p className="text-[#BA1A1A] text-sm">{errorMsg}</p>}
          </div>
        </motion.div>
      </main>
    );
  }

  if (user && needsOnboarding) {
    return <Onboarding />;
  }

  if (user && role && !needsOnboarding) {
    return <Dashboard />;
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-6 bg-[#F3F4F9]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex flex-col items-center gap-8"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-outfit text-6xl font-black tracking-tighter flex items-center select-none">
            <span className="text-[#005AC1]">Qu</span>
            <span className="text-[#001D35] ml-[1px]">Kao</span>
          </span>
        </div>

        <div className="w-full max-w-sm mt-4">
          
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-[28px] border border-[#C4C6D0] bg-white text-[#1B1B1F] hover:bg-[#F8F9FF] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="font-bold text-sm">{isSignUp ? "Sign up with Google" : "Sign in with Google"}</span>
          </button>

          <div className="relative flex items-center py-6">
            <div className="flex-grow border-t border-[#E1E2EC]"></div>
            <span className="flex-shrink-0 mx-4 text-[#74777F] text-xs font-bold uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-[#E1E2EC]"></div>
          </div>

          <form onSubmit={isSignUp ? handleEmailSignUp : handleEmailSignIn} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#44474E]" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 rounded-[20px] border border-[#C4C6D0] bg-[#F8F9FF] focus:bg-white focus:border-[#005AC1] focus:ring-1 focus:ring-[#005AC1] outline-none transition-all placeholder:text-[#44474E]/60 text-[#1B1B1F] text-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#44474E]" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 rounded-[20px] border border-[#C4C6D0] bg-[#F8F9FF] focus:bg-white focus:border-[#005AC1] focus:ring-1 focus:ring-[#005AC1] outline-none transition-all placeholder:text-[#44474E]/60 text-[#1B1B1F] text-sm"
              />
            </div>

            {!isSignUp && (
              <div className="w-full flex justify-end">
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                  className="text-[#005AC1] text-xs font-bold hover:underline transition-all cursor-pointer"
                >
                  Forget Password?
                </button>
              </div>
            )}

            {errorMsg && <p className="text-[#BA1A1A] text-xs font-medium bg-[#FFDAD6] p-3 rounded-[16px]">{errorMsg}</p>}
            {resetSent && <p className="text-[#006D3B] text-xs font-medium bg-[#C4EEDB] p-3 rounded-[16px]">Link reset password telah dikirim ke email.</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-[28px] bg-[#005AC1] text-white hover:bg-[#004A9E] transition-all active:scale-[0.98] disabled:opacity-50 mt-2 hover: cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              <span className="font-bold text-sm">{isSignUp ? "Daftar Akun Baru" : "Masuk"}</span>
            </button>
          </form>

        </div>
      </motion.div>
    </main>
  );
}
