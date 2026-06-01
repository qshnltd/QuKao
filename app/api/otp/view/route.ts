import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token tidak ditemukan", success: false }, { status: 400 });
  }

  try {
    const otpDoc = await getDoc(doc(db, "otpTokens", token));

    if (!otpDoc.exists()) {
      return NextResponse.json({ error: "Tautan tidak valid atau tidak dikenali.", success: false }, { status: 404 });
    }

    const tokenData = otpDoc.data();

    if (Date.now() > tokenData.expiresAt) {
       return NextResponse.json({ error: "Tautan ini telah kedaluwarsa (berlaku maksimal 10 menit). Silakan minta kode baru.", success: false }, { status: 400 });
    }

    if (tokenData.burned) {
       return NextResponse.json({ error: "Kode ini sudah berhasil digunakan untuk masuk dan tidak berlaku lagi.", success: false }, { status: 403 });
    }

    return NextResponse.json({ success: true, otp: tokenData.otp, email: tokenData.email });
  } catch (error) {
    console.error("View OTP Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat memuat tautan.", success: false }, { status: 500 });
  }
}
