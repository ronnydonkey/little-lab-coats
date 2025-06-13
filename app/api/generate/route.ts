import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const materials = body.materials;

  if (!materials || !Array.isArray(materials)) {
    return new Response(JSON.stringify({ error: "Invalid input format" }), { status: 400 });
  }

  try {
const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    {
      role: "system",
      content: `
You are a STEM activity generator for kids. Create a fun, SAFE, and hands-on science project that ONLY uses the provided materials. 
DO NOT suggest any additional materials that were not given. If a project isn't possible, say so clearly but kindly.
Make the project engaging and explain it in a way a 10-year-old can understand.`,
    },
    {
      role: "user",
      content: `I have: ${materials.join(", ")}. What can I build?`,
    },
  ],
});

    const message = completion.choices[0].message?.content;

    if (!message) {
      return new Response(JSON.stringify({
        result: "🧪 Hmm… I couldn't generate a project with those materials. Try changing them up!",
      }));
    }

    return new Response(JSON.stringify({ result: message }));
  } catch (error: any) {
    console.error("🔴 OpenAI API error:", error);
    return new Response(JSON.stringify({ error: error.message || "Something went wrong" }), { status: 500 });
  }
}