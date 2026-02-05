import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai/openai";
import {
  buildSystemPrompt,
  buildUserPrompt,
} from "@/lib/ai/prompts/letter-generation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { student, bragSheet, tone, angle } = body;

    // Validate required fields
    if (!student || !bragSheet || !tone || !angle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt({ student, bragSheet, tone, angle });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedLetter = completion.choices[0]?.message?.content;

    if (!generatedLetter) {
      return NextResponse.json(
        { error: "Failed to generate letter" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      letter: generatedLetter,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("Letter generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate letter" },
      { status: 500 }
    );
  }
}
