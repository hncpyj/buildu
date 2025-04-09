// utils/humanizer.ts

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function rewriteText(inputText: string, level: 'safe' | 'aggressive') {
  const prompt = `
You are a writing assistant designed to rewrite text so that it avoids detection by AI content detectors like GPTZero and Originality.ai.

Here is a reference example of a human-written application that successfully passes all major AI detectors:

"""
As a junior digital marketing specialist with Left Kidney Media Group, I recently opened up my employment availability to seek new opportunities and growth. This morning, I came across the job ad for a senior digital marketing specialist / marketing coordinator at Samson & Hedges, and I jumped at the chance. With my 2.5 years working with similar tools, demographics, and media formats, I am positive I would be a great fit on the marketing team.

You mentioned in the job ad that you’re looking for a marketing associate skilled at copywriting, analytics, and increasing conversions. At Left Kidney, I was responsible for similar projects, from improving the CTR of landing pages to upping rankings of key landing pages in the SERPs. During my time there, I was able to increase sales by 13% through my marketing efforts, and I’m sure I could transfer those same marketing skills and technical abilities over to Samson & Hedges for the senior digital marketing specialist / marketing coordinator role, as well.
"""

Your task is to rewrite the following input so that:
- It matches the natural tone and human-like imperfections of the reference above
- It sounds simple, authentic, slightly conversational, and natural in rhythm
- It avoids common GPT-style expressions or robotic structure
- It retains the original meaning and purpose of the input

Input to rewrite:
"""
${inputText}
"""

Level: ${level}
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
  })

  return completion.choices[0].message.content?.trim() || ''
}