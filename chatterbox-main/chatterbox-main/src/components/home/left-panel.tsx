import { ListFilter, LogOut, MessageSquareDiff, Search, User } from "lucide-react";
import { Input } from "../ui/input";
import ThemeSwitch from "./theme-switch"; 
import Conversation from "./converastion";
import { UserButton } from "@clerk/nextjs";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/clerk-react";
import UserListDialog from "./user-list-dialog";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import toast from "react-hot-toast";


const LeftPanel = () => {
	const {isAuthenticated} = useConvexAuth();
	const conversations = useQuery(api.conversation.getMyConversation,
		isAuthenticated?undefined:"skip"
	);
	const me = useQuery(api.users.getMe);
	const botdetails=useQuery(api.users.getBotId);
	const createConversation = useMutation(api.conversation.createConversation);
	const updateuser= useMutation(api.users.setUserBotconnected);
	const [isLoading, setIsLoading] = useState(false);
    const users = useQuery(api.users.getUser);
	const botconnected =me?.isbotconnect;
	// const botid="1234567890";

	const handleCreateConversation = async () => {
		setIsLoading(true);
		try { 
			const myId = me?._id;
			if (!myId) {
				throw new Error("User ID is not available.");
			}
			console.log("i am in")
			let conversationId;
			let botid;
			if(botdetails){
				botid = botdetails[0]?._id;
			}
			console.log(botid,myId);
			
			if(botid){
				conversationId = await createConversation({
					participants: [botid, myId],
					isGroup: false,
					groupName:"ChatBot ChatterBox",
			});
			if(conversationId != null){
				await updateuser({
					tokenIdentifier:me?.tokenIdentifier,
				})
			}
			}else{
				setIsLoading(false);
				toast.error("Unable to create conversation with chatbot");
			}

		} catch (err) {
			setIsLoading(false);
			console.log(err);
			toast.error("Failed to create conversation");
		} finally {
			setIsLoading(false);
		}
	}
	return (
		// <div className='w-1/4 border-gray-600 border-r'>
		<div className='w-1/4 border-gray-600 border-r rounded-[10px]'>
			<div className='sticky top-0 bg-left-panel z-10'>
				{/* Header */}
				<div className='flex justify-between bg-gray-primary p-3 items-center'>
					 
					 <UserButton/>
					<div className='flex items-center gap-3'>
						{isAuthenticated && < UserListDialog/>}
						{/* <MessageSquareDiff size={20} /> TODO: This line will be replaced with <UserListDialog /> */}
						 
						{/* <LogOut size={20} className='cursor-pointer' /> */}
					</div>
				</div>
				<div className='p-3 flex items-center'>
					{/* Search */}
					<div className='relative h-10 mx-3 flex-1'>
						<Search
							className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10'
							size={18}
						/>
						<Input
							type='text'
							placeholder='Search or start a new chat'
							className='pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent'
						/>
					</div>
				</div>
				{!botconnected &&
				<div className='p-3 flex items-center'>
				<div className='relative h-10 mx-3 flex-1'>
						<button className='pl-10 py-2 text-sm w-full rounded shadow-sm bg-gray-primary focus-visible:ring-transparent'
						onClick={handleCreateConversation}
						disabled={isLoading}
						> {isLoading ? (
							<div className='w-5 h-5 border-t-2 border-b-2 rounded-full animate-spin' />
						) : (
							"Chat With Bot"
						)}
						</button>
				</div>
				</div>
				}
			</div>

			{/* Chat List */}
			<div className='my-3 flex flex-col gap-0 max-h-[80%] overflow-auto'>
			 
				{conversations?.map((conversation)=>(
					<Conversation key={conversation._id} conversation={conversation} />
				))}
				{conversations?.length === 0 && (
					<>
						<p className='text-center text-gray-500 text-sm mt-3'>No conversations yet</p>
						<p className='text-center text-gray-500 text-sm mt-3 '>
							We understand {"you're"} an introvert, but {"you've"} got to start somewhere
						</p>
					</>
				)}
			</div>
		</div>
	);
};
export default LeftPanel;