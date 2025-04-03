// src/lib/extractText.ts
import mammoth from "mammoth";
import pdfParse from "pdf-parse";

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdfParse(buffer);
  return data.text || "";
}

export async function extractTextFromDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value || "";
}
