import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const email = reqBody.email?.trim().toLowerCase();
    const otp = reqBody.otp?.trim();
    const token = reqBody.token?.trim(); // This is the ViewToken passed downwards

    if (!email || !otp || !token) {
      return NextResponse.json({ error: "Lengkapi data untuk verifikasi" }, { status: 400 });
    }

    const otpDocRef = doc(db, "otpTokens", token);
    const otpDoc = await getDoc(otpDocRef);

    if (!otpDoc.exists()) {
       return NextResponse.json({ error: "Sesi OTP tidak valid atau hilang. Silakan kirim ulang OTP." }, { status: 400 });
    }

    const tokenData = otpDoc.data();

    // Pastikan email sesuai
    if (tokenData.email !== email) {
       return NextResponse.json({ error: "Email tidak cocok dengan kode OTP" }, { status: 400 });
    }

    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ error: "Kode OTP telah kedaluwarsa. Silakan kirim ulang." }, { status: 400 });
    }
    
    if (tokenData.burned) {
       return NextResponse.json({ error: "Kode OTP sudah pernah digunakan sebelumnya." }, { status: 400 });
    }

    if (tokenData.otp !== otp) {
      return NextResponse.json({ error: "Kode OTP yang Anda masukkan salah." }, { status: 400 });
    }

    // Mark as burned permanently!
    await updateDoc(otpDocRef, { burned: true });

    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ error: "Terjadi gangguan sistem. Coba lagi nanti." }, { status: 500 });
  }
}
