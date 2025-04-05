import { NextResponse } from "next/server";
import { getDiffHtml } from "@/utils/textDiff";
import { errorResponse } from "@/utils/response";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const oldText = formData.get("oldText") as string | null;
    const newText = formData.get("newText") as string | null;

    if (!oldText || !newText) {
      return errorResponse("Both texts are required", 400);
    }

    const highlighted = getDiffHtml(oldText, newText);
    return NextResponse.json({ highlighted });
  } catch (error) {
    console.error("Compare API Error:", error);
    return errorResponse("Failed to compare documents");
  }
}