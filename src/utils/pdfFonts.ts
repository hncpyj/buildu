// src/fonts/pdfFonts.ts
import { jsPDF } from "jspdf";
import { malgunGothicBase64 } from "@/fonts/malgunBase64";

export function registerMalgunGothic(doc: jsPDF) {
  doc.addFileToVFS("malgun.ttf", malgunGothicBase64);
  doc.addFont("malgun.ttf", "MalgunGothic", "normal");
  doc.setFont("MalgunGothic");
}