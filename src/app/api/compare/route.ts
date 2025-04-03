import { NextResponse } from "next/server";
import { extractTextFromPdf, extractTextFromDocx } from "@/lib/extractText";
import * as Diff from 'diff';

export async function POST(req: Request) {
  try {
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

    const changes = Diff.diffWords(text1, text2);
    const highlighted = changes.map(part => {
      if (part.added) return `<span class="bg-green-300 px-1">${part.value}</span>`;
      if (part.removed) return `<span class="bg-red-300 px-1">${part.value}</span>`;
      return part.value;
    }).join(" ");

    return NextResponse.json({ highlighted });
  } catch (error: any) {
    console.error("Comparison Error:", error);
    return NextResponse.json({ error: "Failed to compare documents" }, { status: 500 });
  }
}
