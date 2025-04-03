import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function getResumeFeedback(resumeText: string) {
  const prompt = `이력서를 분석하여 피드백을 제공해주세요:\n\n"${resumeText}"`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo", // gpt-4 대신 gpt-4-turbo 사용
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}