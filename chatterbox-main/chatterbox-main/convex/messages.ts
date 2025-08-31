"use client"
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { promises } from "dns";
import { api } from "./_generated/api";

export const sendTextMessage = mutation({
    args:{
        sender:v.string(),
        content:v.string(),
        conversation:v.id("conversations")
    },
    handler:async(ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("UN AUTHORIZED");
        }
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",q=>q.eq("tokenIdentifier",identity.tokenIdentifier)).unique();
        if(!user){
            throw new ConvexError("User Not Found");

        }
        const conversation = await ctx.db.query("conversations")
        .filter(q=>q.eq(q.field("_id"),args.conversation)).first();
        if(!conversation){
            throw new ConvexError("Conversaton Not Found");

        }
        if(!conversation.participants.includes(user._id)){
            throw new ConvexError("You are not part of this group");
        }
        await ctx.db.insert("messages",{
            sender:args.sender,
            content:args.content,
            conversation:args.conversation,
            messageType:"text",

        });
         
        
        if(args.content.startsWith("@bot")){
            console.log("yes there is message",args.content)
            await ctx.scheduler.runAfter(0,api.genai.chat,{
                messageBody:args.content,
                conversation:args.conversation
            })
        }     
    }
})


export const sendTextMessagetoBot = mutation({
    args:{
        sender:v.string(),
        content:v.string(),
        conversation:v.id("conversations")
    },
    handler:async(ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("UN AUTHORIZED");
        }
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",q=>q.eq("tokenIdentifier",identity.tokenIdentifier)).unique();
        if(!user){
            throw new ConvexError("User Not Found");

        }
        const conversation = await ctx.db.query("conversations")
        .filter(q=>q.eq(q.field("_id"),args.conversation)).first();
        if(!conversation){
            throw new ConvexError("Conversaton Not Found");

        }
        if(!conversation.participants.includes(user._id)){
            throw new ConvexError("You are not part of this group");
        }
        await ctx.db.insert("messages",{
            sender:args.sender,
            content:args.content,
            conversation:args.conversation,
            messageType:"text",

        });

            await ctx.scheduler.runAfter(0,api.genai.chat,{
                messageBody:args.content,
                conversation:args.conversation
            })
    }
})
export const sendAigeneratedMessage = mutation({
    args:{
        content:v.string(),
        conversation:v.id("conversations")
    },
    
    handler:async(ctx,args)=>{
        await ctx.db.insert("messages",{
            sender:"AIBot",
            content:args.content,
            conversation:args.conversation,
            messageType:"text",

        });
    }
    

})


export const getMessages= query({
    args:{
        conversation:v.id("conversations")
    },
    handler:async(ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("UN AUTHORIZED");
        }
        const messages = await ctx.db.query("messages").withIndex("by_conversation",q=>q.eq("conversation",args.conversation)).collect();

        const userProfileCache = new Map();

        const messageswithsender = await Promise.all(

            messages.map(async (message) =>{
                if(message.sender === "CHatGPT"){
                    return {...message,sender:{name:"CHatGPT",image:"/bot.png"}}
                }
                let sender;
                if(userProfileCache.has(message.sender)){
                    sender = userProfileCache.get(message.sender);
                }else{
                    sender = await ctx.db.query("users").filter(q=>q.eq(q.field("_id"),message.sender)).first();
                    userProfileCache.set(message.sender,sender);
                }

                return {...message,sender};
            })
        );
        return messageswithsender;
    },
})
 