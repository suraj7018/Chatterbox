import { messages } from "@/dummy-data/db";
import { IMessage, useConversationstore } from "@/store/chat-store";
import Chatbubbleavatart from "./chatbubbleavatar";



type messagetypeprops={
	msg:IMessage;
	me:any;
}
const ChatBubble = ({me,msg}:messagetypeprops) => {
	const date = new Date(msg._creationTime);
	const hour = date.getHours().toString().padStart(2,"0");
	const minute = date.getMinutes().toString().padStart(2,"0");
	const time = `${hour} :${minute}`;
	const {selectedConversation} = useConversationstore();
	const isMember = selectedConversation?.participants.includes(msg.sender?._id) || false;
	const isGroup = selectedConversation?.isGroup || false;
	const fromme = msg.sender?._id === me._id;
	const fromAI = msg.sender?.name === "AIBot";
	const bgClass = fromme ?"bg-blue-chat": !fromAI?"bg-white dark:bg-gray-primary" :"bg-blue-500 text-white";


	if(!fromme){
		return(
			<>
			<div className="flex gap-1 w-2/3">
			<Chatbubbleavatart
			isGroup={isGroup}
			isMember={isMember}
			message={msg}
			fromAI={fromAI}
			 />
			<div className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}>
				
				  <p className={`mr-2 text-sm font-light`}>{msg.content}</p>
				  <p className='text-[10px] mt-2 self-end flex gap-1 items-center'>
					{time} 
				  </p>
			</div>
				
			</div>
			</>
		)
	}else{
		return(
			<>
			<div className="flex gap-1 w-2/3 ml-auto">
			<div className={`flex z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}>
				 
				  <p className={`mr-2 text-sm font-light`}>{msg.content}</p>
				  <p className='text-[10px] mt-2 self-end flex gap-1 items-center'>
					{time} 
				  </p>
			</div>
				
			</div>
			</>
		)
	}
};
export default ChatBubble;