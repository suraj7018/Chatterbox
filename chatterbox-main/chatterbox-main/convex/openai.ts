import OpenAI from "openai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
const apiKey="tempo";
const openai = new OpenAI({ apiKey });

export const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    try {
      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",  // Corrected model name
        messages: [
          {
            role: "system",
            content:
              "You are a terse bot in a personal chat and need to respond to questions with 1 sentence.",
          },
          { role: "user", content: args.messageBody },
        ],
      });

      // Log the full API response for better debugging
      console.log("OpenAI API response: ", JSON.stringify(stream, null, 2));

      const messageContent = stream.choices?.[0]?.message?.content ?? "I am sorry";

      console.log("Sending message: ", {
        content: messageContent,
        conversation: args.conversation,
      });

      await ctx.runMutation(api.messages.sendAigeneratedMessage, {
        content: messageContent,
        conversation: args.conversation,
      });

    } catch (error) {
      console.error("Error while interacting with OpenAI API: ", error);
      await ctx.runMutation(api.messages.sendAigeneratedMessage, {
        content: "I'm having trouble responding right now. Please try again later.",
        conversation: args.conversation,
      });
    }
  },
});
