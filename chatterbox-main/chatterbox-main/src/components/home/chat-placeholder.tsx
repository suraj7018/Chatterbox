import { Lock } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const ChatPlaceHolder = () => {
	return (
		<div className='w-3/4 bg-gray-secondary flex flex-col items-center justify-center py-10'>
			<div className='flex flex-col items-center w-full justify-center py-10 gap-4'>
				<p className='text-4xl font-semibold mt-5 mb-2 text-gray-800'>Welcome to <strong>ChatterBox!</strong></p>
				<Image src={"/image.png"} alt='Hero' width={320} height={188} />
				<p className='w-1/2 text-center text-gray-primary text-sm text-muted-foreground'>
					Dive into dynamic conversations with <strong>ChatterBox</strong>—the ultimate platform for <strong>personal and group chats</strong>. Create your own groups, connect effortlessly with friends, and take your interactions to the next level with our <strong>integrated AI assistant</strong>.
				</p>
			</div>
			<p className='w-1/2 mt-auto text-center text-gray-primary text-xs text-muted-foreground flex items-center justify-center gap-1'>
				<Lock size={10} /> <strong>Secure & Private</strong>
			</p>
		</div>
	);
	
};
export default ChatPlaceHolder;