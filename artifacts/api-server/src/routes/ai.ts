import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, chatMessagesTable } from "@workspace/db";
import { SendChatMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();
const USER_ID = "default";

router.get("/ai/chat", async (_req, res): Promise<void> => {
  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.userId, USER_ID))
    .orderBy(chatMessagesTable.createdAt);
  res.json(messages);
});

router.post("/ai/chat", async (req, res): Promise<void> => {
  const parsed = SendChatMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Save user message
  const [userMsg] = await db.insert(chatMessagesTable).values({
    userId: USER_ID,
    role: "user",
    content: parsed.data.content,
  }).returning();

  // Get history for context
  const history = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.userId, USER_ID))
    .orderBy(chatMessagesTable.createdAt);

  const apiKey = process.env.OPENAI_API_KEY;
  let assistantContent = "I'm your Pellazgo AI assistant. I can help you discover businesses, find the best deals, manage your loyalty points, recommend products, and much more. What can I help you with today?";

  if (apiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are Pellazgo's AI concierge — an intelligent lifestyle assistant for a premium commerce and discovery platform. You help users discover local businesses, find the best deals and offers, manage their loyalty rewards, explore products, get personalized recommendations, plan shopping, compare products, and anything related to lifestyle and commerce. Be warm, helpful, concise, and sophisticated. The platform has restaurants, cafes, retail shops, spas, and more. Users earn loyalty points and can redeem rewards. Keep responses under 150 words unless the user asks for detailed information.`,
            },
            ...history.slice(-10).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
          ],
          max_tokens: 300,
        }),
      });

      if (response.ok) {
        const data = await response.json() as { choices: Array<{ message: { content: string } }> };
        assistantContent = data.choices[0]?.message?.content ?? assistantContent;
      }
    } catch {
      // fallback to default response
    }
  }

  const [assistantMsg] = await db.insert(chatMessagesTable).values({
    userId: USER_ID,
    role: "assistant",
    content: assistantContent,
  }).returning();

  res.json(assistantMsg);
});

router.delete("/ai/chat/clear", async (_req, res): Promise<void> => {
  await db.delete(chatMessagesTable).where(eq(chatMessagesTable.userId, USER_ID));
  res.sendStatus(204);
});

export default router;
