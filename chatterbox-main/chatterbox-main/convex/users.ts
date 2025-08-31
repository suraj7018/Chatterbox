import {ConvexError, v} from 'convex/values'
import { internalMutation,mutation,query } from './_generated/server'
import { error } from 'console'
import { api } from './_generated/api'

export const createUser = internalMutation({

    args:{
        
        tokenIdentifier:v.string(),
        email:v.string(),   
        name:v.string(),
        image:v.string(),

    },
    handler:async (ctx,args)=>{
        await ctx.db.insert("users",{
            tokenIdentifier:args.tokenIdentifier,
            email:args.email,
            name:args.name,
            image:args.image,
            isOnline:true,
            isbotconnect:false
            
        })
         
    },
    
    
})

export const updateUser=internalMutation({
    args:{tokenIdentifier:v.string(),image:v.string()},
    handler:async(ctx,args)=>{
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",q=> q.eq("tokenIdentifier",args.tokenIdentifier)).unique();

        if(!user){
            throw new ConvexError("User Not found");
        }
        await ctx.db.patch(user._id,{image:args.image});
    }
})


export const setUserOffline=internalMutation({
    args:{tokenIdentifier:v.string()},
    handler:async(ctx,args)=>{
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",q=> q.eq("tokenIdentifier",args.tokenIdentifier)).unique();

        if(!user){
            throw new ConvexError("User Not found");
        }
        await ctx.db.patch(user._id,{isOnline:false});
    }
})

export const setUserBotconnected=mutation({
    args:{tokenIdentifier:v.string()},
    handler:async(ctx,args)=>{
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",q=> q.eq("tokenIdentifier",args.tokenIdentifier)).unique();

        if(!user){
            throw new ConvexError("User Not found");
        }
        await ctx.db.patch(user._id,{isbotconnect:true});
    }
})

export const setUserOnline=internalMutation({
    args:{tokenIdentifier:v.string()},
    handler:async(ctx,args)=>{
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",q=> q.eq("tokenIdentifier",args.tokenIdentifier)).unique();

        if(!user){
            throw new ConvexError("User Not found");
        }
        await ctx.db.patch(user._id,{isOnline:true});
    }
})

export const getUser = query({
    args:{},
    handler:async (ctx,args)=>{
        const data = await ctx.auth.getUserIdentity();
        if(!data){
            throw new ConvexError("Unauthorized");
        }
        const users = await ctx.db.query("users").collect();
        const updatedusers= users.filter((user)=>user.tokenIdentifier !== data.tokenIdentifier);
        return updatedusers.filter((user)=>user.name !== "ChatBot ChatterBox");
    }
})

export const getUserDetailbyid = query({
    args:{det:v.id("users")},
    handler:async (ctx,args)=>{
        const data = await ctx.auth.getUserIdentity();
        if(!data){
            throw new ConvexError("Unauthorized");
        }
        const users = await ctx.db.query("users").collect();
        return users.filter((user)=>user._id === args.det);
    }
})


export const getMe = query({
    args:{},
    handler:async (ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("Unauthorized");
        }
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",(q)=>q.eq("tokenIdentifier",identity.tokenIdentifier)).unique();
        if(!user){
            throw new ConvexError("User Not Found");

        }
        return user;
    }

})

export const getBotId = query({
    args:{},
    handler:async (ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("Unauthorized");
        }
        const user = await ctx.db.query("users").withIndex("by_tokenIdentifier",(q)=>q.eq("tokenIdentifier",identity.tokenIdentifier)).unique();
        if(!user){
            throw new ConvexError("User Not Found");
        }
        const updatedusers = await ctx.db.query("users").collect();
        return updatedusers.filter((user)=>user.name === "ChatBot ChatterBox");
        
    }

})

export const getGroupMember = query({
    args:{conversationId:v.id("conversations")},


    handler:async (ctx,args)=>{
        const identity = await ctx.auth.getUserIdentity();
        if(!identity){
            throw new ConvexError("UnAuthorized");
        }
        const conversation  = await ctx.db.query("conversations")
        .filter((q)=>q.eq(q.field("_id"),args.conversationId)).first();
        if(!conversation){
            throw new ConvexError("Conversation Node found");
        }

        const users = await ctx.db.query("users").collect();
        const groupMember = users.filter((user)=> conversation.participants.includes(user._id));
        return groupMember;

    }
})

