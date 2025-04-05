import { NextResponse } from "next/server";
import { getResumeFeedback } from "@/lib/openai";

export const config = {
  runtime: "nodejs",
  maxDuration: 20,
};

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json({ error: "No resume provided" }, { status: 400 });
    }

    const feedback = await getResumeFeedback(resumeText);

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unknown server error occurred.",
      },
      { status: 500 }
    );
  }
}