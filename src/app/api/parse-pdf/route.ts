// /api/compare
import { NextResponse } from "next/server";
import { extractTextFromPdf, extractTextFromDocx } from "@/lib/extractText";
import { diffWords, Change } from "diff";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // JSON 요청: 텍스트 기반 비교
    if (contentType.includes("application/json")) {
      const { oldText, newText } = await req.json();
      if (!oldText || !newText) {
        return NextResponse.json({ error: "Both oldText and newText are required" }, { status: 400 });
      }
      return NextResponse.json({ highlighted: getDiffHtml(oldText, newText) });
    }

    // FormData 요청: 파일 기반 비교
    const formData = await req.formData();
    const oldFile = formData.get("oldFile") as File | null;
    const newFile = formData.get("newFile") as File | null;
    const oldText = formData.get("oldText") as string | null;
    const newText = formData.get("newText") as string | null;

    let text1 = oldText || "";
    let text2 = newText || "";

    if (oldFile) {
      text1 = oldFile.type === "application/pdf"
        ? await extractTextFromPdf(oldFile)
        : await extractTextFromDocx(oldFile);
    }

    if (newFile) {
      text2 = newFile.type === "application/pdf"
        ? await extractTextFromPdf(newFile)
        : await extractTextFromDocx(newFile);
    }

    return NextResponse.json({ highlighted: getDiffHtml(text1, text2) });
  } catch (error) {
    console.error("Comparison Error:", error);
    return NextResponse.json({ error: "Failed to compare documents" }, { status: 500 });
  }
}

function getDiffHtml(a: string, b: string): string {
  const changes: Change[] = diffWords(a, b);
  return changes.map((part) => {
    if (part.added) return `<span class="bg-green-300 px-1">${part.value}</span>`;
    if (part.removed) return `<span class="bg-red-300 px-1">${part.value}</span>`;
    return part.value;
  }).join(" ");
}
