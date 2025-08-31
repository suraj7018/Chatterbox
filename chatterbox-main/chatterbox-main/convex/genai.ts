import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

 
const genAI = new GoogleGenerativeAI("AIzaSyA4yqRHI2z7yeJwwbPrWrIPyKzqJ3eAKY0");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    try {
      console.log("Entering chat handler");
      
      // Log the message body and conversation ID
      console.log("Message Body: ", args.messageBody);
      console.log("Conversation ID: ", args.conversation);

     const questionbody = args.messageBody + " answer only at max 2-3 sentence."
      // Log the model instantiation
      console.log("Generated Model: ", model);

      const result = await model.generateContent(questionbody);

      // Log the raw result from the AI API
      console.log("AI Response: ", result);

      const messageContent = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "I am sorry";

      // Log the message content that will be sent
      console.log("Generated Message Content: ", messageContent);

      await ctx.runMutation(api.messages.sendAigeneratedMessage, {
        content: messageContent,
        conversation: args.conversation,
      });

    } catch (error) {
      console.error("Error while interacting with Generative AI API: ", error);
      await ctx.runMutation(api.messages.sendAigeneratedMessage, {
        content: "I'm having trouble responding right now. Please try again later.",
        conversation: args.conversation,
      });
    }
  },
});

