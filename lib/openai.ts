import type { NextApiRequest, NextApiResponse } from "next";
import openai from "@/lib/openai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { materials } = req.body;

  if (!materials || !Array.isArray(materials)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You're a fun, safe STEM project generator for kids.",
        },
        {
          role: "user",
          content: `Suggest a kid-safe STEM project using: ${materials.join(", ")}`,
        },
      ],
    });

    res.status(200).json({ result: completion.choices[0].message?.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}