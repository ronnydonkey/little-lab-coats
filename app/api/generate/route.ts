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
You are a STEM activity generator for children. Only generate projects using the **exact list of materials provided**. Do not add any other items — not even common ones like scissors, tape, batteries, etc.

❌ Do NOT suggest anything that includes fire, heat, sharp objects, or unsafe elements.
✅ Stay simple, safe, and fun. Activities should be doable by a 6–10 year old with basic adult supervision.

If a project can't be safely made with the provided materials, return a friendly message suggesting to try different materials.

Format your output like this:
- Project Name:
- Objective:
- Materials Used:
- Steps (with simple numbered instructions):`,
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