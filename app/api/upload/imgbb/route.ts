import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const keys = [
      process.env.IMGBB_API_KEY_1,
      process.env.IMGBB_API_KEY_2,
      process.env.IMGBB_API_KEY_3,
    ].filter(Boolean);

    if (keys.length === 0) {
      return NextResponse.json({ error: "Server is not configured for image uploads" }, { status: 500 });
    }

    // Try uploading using one of the keys
    for (const key of keys) {
      try {
        const imgbbFormData = new FormData();
        imgbbFormData.append("image", image);
        
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
          method: "POST",
          body: imgbbFormData,
        });

        const data = await response.json();

        if (response.ok && data.success) {
          return NextResponse.json({ url: data.data.url });
        }
        
        console.error(`ImgBB error with key ...${key?.slice(-4)}:`, data);
      } catch (e) {
        console.error(`Fetch error with key ...${key?.slice(-4)}:`, e);
      }
    }

    return NextResponse.json({ error: "Failed to upload image after trying available keys" }, { status: 500 });

  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
