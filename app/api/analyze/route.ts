import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "No text provided." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing." },
        { status: 500 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are TruePen, an academic writing analysis tool. Return only valid JSON.",
        },
        {
          role: "user",
          content: `
Analyze this academic text.

Return JSON only with:
{
  "aiLikeness": number,
  "humanAuthenticity": number,
  "academicQuality": number,
  "feedback": ["string", "string", "string", "string"]
}

Text:
${text}
`,
        },
      ],
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No AI response." }, { status: 500 });
    }

    const result = JSON.parse(content);

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to analyze text." },
      { status: 500 }
    );
  }
}