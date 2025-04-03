import { NextResponse } from "next/server";
import { getResumeFeedback } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();
    if (!resumeText) {
      return NextResponse.json({ error: "No resume provided" }, { status: 400 });
    }

    const feedback = await getResumeFeedback(resumeText);
    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { getResumeFeedback } from "@/lib/openai";

// export async function POST(req: Request) {
//   try {
//     const { resumeText } = await req.json();
//     if (!resumeText) {
//       return NextResponse.json({ error: "No resume provided" }, { status: 400 });
//     }

//     const feedback = await getResumeFeedback(resumeText);
//     return NextResponse.json({ feedback });
//   } catch (error: any) {
//     console.error("API Error:", error);
//     return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
//   }
// }
