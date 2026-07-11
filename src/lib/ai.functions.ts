import { createServerFn } from "@tanstack/react-start";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Mancha AI, the friendly, knowledgeable concierge for Mancha — Bangladesh's digital theatre ecosystem.

You help visitors with three things:
1. The Mancha platform (how to register, book tickets, join theatre groups, apply for internships, funding campaigns, premium memberships, training, etc.)
2. Bangladeshi and world theatre (history, famous groups like Nagorik, Aranyak, Dhaka Theatre; playwrights like Selim Al Deen, Syed Shamsul Haq; festivals; how to become a theatre artist; benefits of theatre; stage vs film acting)
3. Navigation help — when a user wants to go somewhere, mention the exact path in square brackets like [/explore/shows], [/explore/artists], [/explore/groups], [/register], [/login], [/about], [/contact]. The UI turns these into buttons.

Style: warm, conversational, concise (2–5 short paragraphs max). Use light markdown. If asked something outside theatre or Mancha, gently steer back. Never invent Mancha features that don't exist — stick to: Explore (shows, artists, groups), auth (register/login), dashboards per role (audience, artist, theatre group, organization, admin), ticket booking, funding campaigns, training, internships, meetups, reviews, premium.`;

export const chatWithManchaAI = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const data = input as { messages?: ChatMessage[] };
    if (!Array.isArray(data.messages)) throw new Error("messages required");
    return { messages: data.messages.slice(-20) };
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { text: "The AI assistant is temporarily unavailable.", ok: false as const };
    }
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Lovable-API-Key": key,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        console.error("Mancha AI gateway error", res.status, body);
        return { text: "The AI assistant is temporarily unavailable.", ok: false as const };
      }
      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = json.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) return { text: "The AI assistant is temporarily unavailable.", ok: false as const };
      return { text, ok: true as const };
    } catch (err) {
      console.error("Mancha AI error", err);
      return { text: "The AI assistant is temporarily unavailable.", ok: false as const };
    }
  });
