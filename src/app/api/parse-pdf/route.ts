import { NextResponse, NextRequest } from "next/server";
import pdfParse from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("❌ PDF parsing error:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}

// // /api/parse-pdf
// import { NextResponse, NextRequest } from "next/server";
// import pdfParse from "pdf-parse";

// export async function GET() {
//   return NextResponse.json({ message: "API is working" });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const data = await pdfParse(buffer);

//     console.log("📄 PDF Parsed Text:", data.text);

//     return NextResponse.json({ text: data.text });
//   } catch (error) {
//     console.error("❌ PDF parsing error:", error);
//     return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
//   }
// }
