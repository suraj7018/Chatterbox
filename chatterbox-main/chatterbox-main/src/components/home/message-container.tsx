

import { useEffect, useRef } from 'react';
import ChatBubble from "./chat-bubble";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationstore } from '@/store/chat-store';

const MessageContainer = () => {
    const { selectedConversation } = useConversationstore();
    const messages = useQuery(api.messages.getMessages, {
        conversation: selectedConversation!._id
    });
    const me = useQuery(api.users.getMe);

    // Create a ref for the end of the messages container
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom when messages change
    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='relative p-3 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark'>
            <div className='mx-12 flex flex-col gap-3 h-full'>
                {messages?.map((msg) => (
                    <div key={msg._id}>
                        {me && <ChatBubble me={me} msg={msg} />}
                    </div>
                ))}
               
                <div ref={endOfMessagesRef} />
            </div>
        </div>
    );
};

export default MessageContainer;
