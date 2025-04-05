import { NextResponse } from "next/server";
import { getResumeFeedback } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();
    if (!resumeText) {
      return NextResponse.json({ error: "No resume provided" }, { status: 400 });
    }

    const start = Date.now(); // 타이머 시작
    const feedback = await getResumeFeedback(resumeText);
    const duration = Date.now() - start;

    console.log(`⏱️ getResumeFeedback took ${duration}ms`);

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET 요청 방지
export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}