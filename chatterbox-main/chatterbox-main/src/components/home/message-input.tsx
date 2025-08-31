import { Laugh, Mic, Plus, Send } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { api } from "../../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useConversationstore } from "@/store/chat-store";
import toast from "react-hot-toast";

const MessageInput = () => {
	const [msgText, setMsgText] = useState("");
	const sendTexMsg = useMutation(api.messages.sendTextMessage);
	const senTxtMsgBot = useMutation(api.messages.sendTextMessagetoBot);
	const me = useQuery(api.users.getMe);
	const {selectedConversation} = useConversationstore();
	const botid= useQuery(api.users.getBotId);

	let ischatbot = false;
	if (selectedConversation && selectedConversation.participants.length > 0) {
		console.log("see",selectedConversation?.groupName === "ChatBot ChatterBox" )
		 ischatbot = selectedConversation?.groupName === "ChatBot ChatterBox" ;
    	// ischatbot = selectedConversation[0].email === "chatterboxbot@temp.com";
	} 
	
	const handleSendMesage=async (e:React.FormEvent)=>{
		e.preventDefault();
		try{
			if(ischatbot){
				await senTxtMsgBot({content:msgText,conversation:selectedConversation!._id,sender:me!._id})
			}else{
				await sendTexMsg({content:msgText,conversation:selectedConversation!._id,sender:me!._id})
			}
			setMsgText("");

		}catch(err:any){
			toast.error(err.message);
			console.log(err);
		}

	}

	return (
		<div className='bg-gray-primary p-2 flex gap-4 items-center'>
			<form className='w-full flex gap-3' onSubmit={handleSendMesage}>
				<div className='flex-1'>
					<Input
						type='text'
						placeholder='Type a message'
						className='py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent'
						value={msgText}
						onChange={(e) => setMsgText(e.target.value)}
					/>
				</div>
				<div className='mr-4 flex items-center gap-3'>
					{msgText.length > 0 ? (
						<Button
							type='submit'
							size={"sm"}
							className='bg-transparent text-foreground hover:bg-transparent'
						>
							<Send />
						</Button>
					) : (
						<Button
							type='submit'
							size={"sm"}
							className='bg-transparent text-foreground hover:bg-transparent'
						>
						</Button>
					)}
				</div>
			</form>
		</div>
	);
};
export default MessageInput;