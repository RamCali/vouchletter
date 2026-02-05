import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/ai/anthropic";
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

    // Call Claude
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt },
      ],
    });

    const generatedLetter = message.content[0]?.type === "text"
      ? message.content[0].text
      : null;

    if (!generatedLetter) {
      return NextResponse.json(
        { error: "Failed to generate letter" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      letter: generatedLetter,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    });
  } catch (error) {
    console.error("Letter generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate letter" },
      { status: 500 }
    );
  }
}
