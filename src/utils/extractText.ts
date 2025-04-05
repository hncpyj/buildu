// // src/lib/extractText.ts
// import mammoth from "mammoth";

// export async function extractTextFromDocx(file: File): Promise<string> {
//   const buffer = await file.arrayBuffer();
//   const result = await mammoth.extractRawText({ arrayBuffer: buffer });
//   return result.value || "";
// }

// src/utils/extractDocx.ts

export async function extractTextFromDocx(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (event) => {
      if (!event.target?.result) return reject("파일을 읽을 수 없습니다.");
      const arrayBuffer = event.target.result as ArrayBuffer;

      try {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value || "");
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsArrayBuffer(file);
  });
}