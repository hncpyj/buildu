import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { essayText } = await req.json();

  const prompt = `
You are an IELTS Writing Task 2 examiner.
Evaluate the following essay and give a score out of 9 for the following 4 categories:
1. Task Achievement
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

Then, provide a brief paragraph of overall feedback.

Essay:
${essayText}
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({
    feedback: completion.choices[0].message.content,
  });
}
