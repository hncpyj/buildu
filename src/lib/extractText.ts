import mammoth from "mammoth";
import PDFParser from "pdf2json";

type PDFText = {
  R: { T: string }[];
};

type PDFPage = {
  Texts: PDFText[];
};

type PDFData = {
  formImage: {
    Pages: PDFPage[];
  };
};

export async function extractTextFromPdf(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err: { parserError: string }) => {
      console.error("❌ PDF2JSON parsing error:", err.parserError);
      reject(new Error("Failed to parse PDF."));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: PDFData) => {
      try {
        const pages = pdfData.formImage.Pages;

        const text = pages
          .map((page) =>
            page.Texts.map((t) =>
              decodeURIComponent(t.R[0].T)
            ).join(" ")
          )
          .join("\n\n");

        resolve(text);
      } catch (e) {
        console.error("❌ Text extraction error:", e);
        reject(new Error("Failed to extract text from PDF data."));
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function extractTextFromDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value || "";
}