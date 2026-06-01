import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const email = reqBody.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
       return NextResponse.json({ error: "Resend API key is not configured" }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate very short, clean token for the link to avoid looking like phishing
    const viewToken = crypto.randomBytes(6).toString("hex"); // e.g. "a1b2c3d4e5f6"
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save to Firestore
    try {
      await setDoc(doc(db, "otpTokens", viewToken), {
        email,
        otp,
        expiresAt,
        burned: false
      });
    } catch (e) {
      console.error("Firestore error saving OTP:", e);
      return NextResponse.json({ error: "Gagal menyimpan OTP ke database" }, { status: 500 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://qukao.qzz.io";
    const viewUrl = `${appUrl}/auth/view-otp/${viewToken}`;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Send email
    const { error } = await resend.emails.send({
      from: 'QuKao <onboarding@qukao.hbklrz.my.id>',
      to: email,
      subject: `Secure link to log in to QuKao | ${formattedDate}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, sans-serif; background-color: #f3f4f9; margin: 0; padding: 40px 20px;">
            <div style="max-width: 500px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); text-align: center;">
                <h1 style="font-size: 24px; font-weight: 800; margin: 0 0 10px 0; color: #1B1B1F;">QuKao Access</h1>
                <p style="font-size: 16px; line-height: 1.5; margin: 0 0 32px 0; color: #44474E;">
                    Berikut adalah tautan aman untuk melihat kode OTP Anda.
                </p>
                
                <div style="margin: 0 0 32px 0;">
                    <a href="${viewUrl}" target="_blank" style="display: inline-block; background-color: #005AC1; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 16px 32px; border-radius: 100px;">
                        Lihat Kode OTP
                    </a>
                </div>
                
                <p style="font-size: 13px; line-height: 1.5; margin: 0; color: #74777F;">
                    Tautan ini berlaku selama 10 menit. Jika Anda tidak meminta email ini, aman untuk diabaikan.
                </p>
            </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("[Resend Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully",
      token: viewToken // giving token to client side for future verification
    });
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

