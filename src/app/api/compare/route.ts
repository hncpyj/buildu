import { NextResponse } from "next/server";
import { diffWords, Change } from "diff";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const oldText = formData.get("oldText") as string | null;
    const newText = formData.get("newText") as string | null;

    if (!oldText || !newText) {
      return NextResponse.json({ error: "Both texts are required" }, { status: 400 });
    }

    const changes: Change[] = diffWords(oldText, newText);

    const highlighted = changes.map((part) => {
      if (part.added) return `<span class="bg-green-300 px-1">${part.value}</span>`;
      if (part.removed) return `<span class="bg-red-300 px-1 line-through">${part.value}</span>`;
      return part.value;
    }).join(" ");

    return NextResponse.json({ highlighted });
  } catch (error) {
    console.error("Compare API Error:", error);
    return NextResponse.json({ error: "Failed to compare documents" }, { status: 500 });
  }
}
