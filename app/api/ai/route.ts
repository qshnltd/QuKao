import { NextRequest, NextResponse } from "next/server";
import { generateWithOpenRouter } from "@/lib/openrouter";
import { ModelCategory } from "@/lib/ai-models";

export async function POST(req: NextRequest) {
  try {
    const { messages, category, systemPrompt } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const aiCategory: ModelCategory = category || "tutor";

    const result = await generateWithOpenRouter(messages, aiCategory, systemPrompt);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ success: false, error: result.content }, { status: 200 });
    }
  } catch (error) {
    console.error("[API AI Route Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
