// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
// 	Dialog,
// 	DialogClose,
// 	DialogContent,
// 	DialogDescription,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { ImageIcon, MessageSquareDiff } from "lucide-react";
// import { users } from "@/dummy-data/db";
// import { Id } from "../../../convex/_generated/dataModel";
// import { useMutation, useQueries, useQuery } from "convex/react";
// import { api } from "../../../convex/_generated/api";
// import toast, { Toaster } from "react-hot-toast";
// import { query } from "../../../convex/_generated/server";


// const UserListDialog = () => {
// 	const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
// 	const [groupName, setGroupName] = useState("");
// 	const [isLoading, setIsLoading] = useState(false);
// 	const [selectedImage, setSelectedImage] = useState<File | null>(null);
// 	const [renderedImage, setRenderedImage] = useState("");
// 	const imgRef = useRef<HTMLButtonElement>(null)
//     const dialogCloseRef = useRef<HTMLButtonElement>(null)

//     const createConversation = useMutation(api.conversation.createConversation);
//     const me = useQuery(api.users.getMe);
//     const users = useQuery(api.users.getUser);
//     const generateUploadUrl = useMutation(api.conversation.generateUploadUrl);
//     // const handleCreateConversation=async()=>{
//     //     if(selectedUsers.length ==0)return ;
//     //     setIsLoading(true);
//     //     try{
//     //         const isGroup = selectedUsers.length>1;
//     //         let conversationId;
//     //         if(!isGroup){
// 	// 			console.log('Selected Users ID:', selectedUsers[0]);
// 	// 			console.log('Users Array:', users);

// 	// 			let anotherUserData = users?.find(user => user._id === selectedUsers[0]);
// 	// 			console.log(anotherUserData)

//     //             conversationId =  await createConversation({
//     //                 participants:[...selectedUsers,me?._id!],
//     //                 isGroup:false,
// 	// 				groupName:anotherUserData?.name,
//     //             })

//     //         }else{
//     //             const postUrl = await generateUploadUrl();

//     //             console.log("we get post URL", postUrl);
//     //             const result = await fetch(postUrl, {
//     //                 method: "POST",
//     //                 headers: { "Content-Type": selectedImage?.type! },
//     //                 body: selectedImage
//     //             });

//     //             const { storageId } = await result.json();
//     //             console.log("we get storageid", storageId);

//     //             await createConversation({
//     //                 participants: [...selectedUsers, me?._id],
//     //                 isGroup: true,
//     //                 admin: me?._id,
//     //                 groupName,
//     //                 groupImage: storageId,
//     //             });
 

//     //         }

//     //         dialogCloseRef.current?.click();
//     //         setSelectedUsers([]);
//     //         setGroupName("");
//     //         setSelectedImage(null);



//     //     }catch(err){
//     //         console.log(err);
//     //         toast.error("Failed to create converasation");
//     //     }finally{
//     //         setIsLoading(false);
//     //     }
//     // }
// 	const handleCreateConversation = async () => {
// 		if (selectedUsers.length === 0) return;
// 		setIsLoading(true);
// 		try {
// 			const isGroup = selectedUsers.length > 1;
// 			const myId = me?._id;
	
// 			if (!myId) {
// 				throw new Error("User ID is not available.");
// 			}
	
// 			let conversationId;
// 			if (!isGroup) {
// 				console.log('Selected Users ID:', selectedUsers[0]);
// 				console.log('Users Array:', users);
	
// 				let anotherUserData = users?.find(user => user._id === selectedUsers[0]);
// 				console.log(anotherUserData);
	
// 				conversationId = await createConversation({
// 					participants: [...selectedUsers, myId],
// 					isGroup: false,
// 					groupName: anotherUserData?.name,
// 				});
	
// 			} else {
// 				const postUrl = await generateUploadUrl();
	
// 				console.log("we get post URL", postUrl);
// 				const result = await fetch(postUrl, {
// 					method: "POST",
// 					headers: { "Content-Type": selectedImage?.type! },
// 					body: selectedImage
// 				});
	
// 				const { storageId } = await result.json();
// 				console.log("we get storageId", storageId);
	
// 				conversationId = await createConversation({
// 					participants: [...selectedUsers, myId],
// 					isGroup: true,
// 					admin: myId,
// 					groupName,
// 					groupImage: storageId,
// 				});
// 			}
	
// 			dialogCloseRef.current?.click();
// 			setSelectedUsers([]);
// 			setGroupName("");
// 			setSelectedImage(null);
	
// 		} catch (err) {
// 			console.log(err);
// 			toast.error("Failed to create conversation");
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	}
	
//     useEffect(()=>{
//         if(!selectedImage) return setRenderedImage('')
//             const render = new FileReader();
//         render.onload=(e)=>setRenderedImage(e.target?.result as string);
//         render.readAsDataURL(selectedImage);

//     },[selectedImage])

// 	return (
// 		<Dialog>
// 			<DialogTrigger>
// 				<MessageSquareDiff size={20} />
// 			</DialogTrigger>
// 			<DialogContent>
// 				<DialogHeader>
// 					{/* TODO: <DialogClose /> will be here */}
//                     <DialogClose ref={dialogCloseRef}/>
// 					<DialogTitle>USERS</DialogTitle>
// 				</DialogHeader>

// 				<DialogDescription>Start a new chat</DialogDescription>
// 				{renderedImage && (
// 					<div className='w-16 h-16 relative mx-auto'>
// 						<Image src={renderedImage} fill alt='user image' className='rounded-full object-cover' />
// 					</div>
// 				)}
// 				{/* TODO: input file */}
//                 <input type="file" accept="image/**" ref={imgRef} hidden onChange={(e)=>setSelectedImage(e.target.files![0])}/>
// 				{selectedUsers.length > 1 && (
// 					<>
// 						<Input
// 							placeholder='Group Name'
// 							value={groupName}
// 							onChange={(e) => setGroupName(e.target.value)}
// 						/>
// 						<Button className='flex gap-2' onClick={()=>imgRef.current?.click()}>
// 							<ImageIcon size={20}  />
// 							Group Image
// 						</Button>
// 					</>
// 				)}
// 				<div className='flex flex-col gap-3 overflow-auto max-h-60'>
// 					{users?.map((user) => (
// 						<div
// 							key={user._id}
// 							className={`flex gap-3 items-center p-2 rounded cursor-pointer active:scale-95 
// 								transition-all ease-in-out duration-300
// 							${selectedUsers.includes(user._id) ? "bg-green-primary" : ""}`}
// 							onClick={() => {
// 								if (selectedUsers.includes(user._id)) {
// 									setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
// 								} else {
// 									setSelectedUsers([...selectedUsers, user._id]);
// 								}
// 							}}
// 						>
// 							<Avatar className='overflow-visible'>
// 								{user.isOnline && (
// 									<div className='absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-foreground' />
// 								)}

// 								<AvatarImage src={user.image} className='rounded-full object-cover' />
// 								<AvatarFallback>
// 									<div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full'></div>
// 								</AvatarFallback>
// 							</Avatar>

// 							<div className='w-full '>
// 								<div className='flex items-center justify-between'>
// 									<p className='text-md font-medium'>{user.name || user.email.split("@")[0]}</p>
// 								</div>
// 							</div>
// 						</div>
// 					))}
// 				</div>
// 				<div className='flex justify-between'>
// 					<DialogClose>
// 					<Button variant={"outline"}>Cancel</Button>
// 					</DialogClose>
// 					<Button
//                     onClick={handleCreateConversation}
// 						disabled={selectedUsers.length === 0 || (selectedUsers.length > 1 && !groupName) || isLoading}
// 					>
// 						{/* spinner */}
// 						{isLoading ? (
// 							<div className='w-5 h-5 border-t-2 border-b-2  rounded-full animate-spin' />
// 						) : (
// 							"Create"
// 						)}
// 					</Button>
// 				</div>
// 			</DialogContent>
// 		</Dialog>
// 	);
// };
// export default UserListDialog;


import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ImageIcon, MessageSquareDiff } from "lucide-react";
import { users } from "@/dummy-data/db";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast from "react-hot-toast";

const UserListDialog = () => {
	const [selectedUsers, setSelectedUsers] = useState<Id<"users">[]>([]);
	const [groupName, setGroupName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [renderedImage, setRenderedImage] = useState("");
	const imgRef = useRef<HTMLInputElement>(null);
    const dialogCloseRef = useRef<HTMLButtonElement>(null);

    const createConversation = useMutation(api.conversation.createConversation);
    const me = useQuery(api.users.getMe);
    const users = useQuery(api.users.getUser);
    const generateUploadUrl = useMutation(api.conversation.generateUploadUrl);

	const handleCreateConversation = async () => {
		if (selectedUsers.length === 0) return;
		setIsLoading(true);
		try {
			const isGroup = selectedUsers.length > 1;
			const myId = me?._id;
	
			if (!myId) {
				throw new Error("User ID is not available.");
			}
	
			let conversationId;
			if (!isGroup) {
				console.log('Selected Users ID:', selectedUsers[0]);
				console.log('Users Array:', users);
	
				let anotherUserData = users?.find(user => user._id === selectedUsers[0]);
				console.log(anotherUserData);
	
				conversationId = await createConversation({
					participants: [...selectedUsers, myId],
					isGroup: false,
					groupName: anotherUserData?.name,
				});
	
			} else {
				const postUrl = await generateUploadUrl();
	
				console.log("we get post URL", postUrl);
				const result = await fetch(postUrl, {
					method: "POST",
					headers: { "Content-Type": selectedImage?.type! },
					body: selectedImage
				});
	
				const { storageId } = await result.json();
				console.log("we get storageId", storageId);
	
				conversationId = await createConversation({
					participants: [...selectedUsers, myId],
					isGroup: true,
					admin: myId,
					groupName,
					groupImage: storageId,
				});
			}
	
			dialogCloseRef.current?.click();
			setSelectedUsers([]);
			setGroupName("");
			setSelectedImage(null);
	
		} catch (err) {
			console.log(err);
			toast.error("Failed to create conversation");
		} finally {
			setIsLoading(false);
		}
	}
	
    useEffect(() => {
        if (!selectedImage) return setRenderedImage('');
        const render = new FileReader();
        render.onload = (e) => setRenderedImage(e.target?.result as string);
        render.readAsDataURL(selectedImage);

    }, [selectedImage]);

	return (
		<Dialog>
			<DialogTrigger>
				<MessageSquareDiff size={20} />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogClose ref={dialogCloseRef} />
					<DialogTitle>USERS</DialogTitle>
				</DialogHeader>

				<DialogDescription>Start a new chat</DialogDescription>
				{renderedImage && (
					<div className='w-16 h-16 relative mx-auto'>
						<Image src={renderedImage} fill alt='user image' className='rounded-full object-cover' />
					</div>
				)}
				<input 
					type="file" 
					accept="image/**" 
					ref={imgRef} 
					hidden 
					onChange={(e) => setSelectedImage(e.target.files![0])} 
				/>
				{selectedUsers.length > 1 && (
					<>
						<Input
							placeholder='Group Name'
							value={groupName}
							onChange={(e) => setGroupName(e.target.value)}
							style={{ border: '0.5px solid black' }}
						/>

						<Button className='flex gap-2' onClick={() => imgRef.current?.click()}>
							<ImageIcon size={20} />
							Group Image
						</Button>
					</>
				)}
				<div className='flex flex-col gap-3 overflow-auto max-h-60'>
					{users?.map((user) => (
						<div
							key={user._id}
							className={`flex gap-3 items-center p-2 rounded cursor-pointer active:scale-95 
								transition-all ease-in-out duration-300
							${selectedUsers.includes(user._id) ? "bg-green-primary" : ""}`}
							onClick={() => {
								if (selectedUsers.includes(user._id)) {
									setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
								} else {
									setSelectedUsers([...selectedUsers, user._id]);
								}
							}}
						>
							<Avatar className='overflow-visible'>
							 

								<AvatarImage src={user.image} className='rounded-full object-cover' />
								<AvatarFallback>
									<div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full'></div>
								</AvatarFallback>
							</Avatar>

							<div className='w-full '>
								<div className='flex items-center justify-between'>
									<p className='text-md font-medium'>{user.name || user.email.split("@")[0]}</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className='flex justify-between'>
					<DialogClose>
						<Button variant={"outline"}>Cancel</Button>
					</DialogClose>
					<Button
						onClick={handleCreateConversation}
						disabled={selectedUsers.length === 0 || (selectedUsers.length > 1 && !groupName) || isLoading}
					>
						{isLoading ? (
							<div className='w-5 h-5 border-t-2 border-b-2 rounded-full animate-spin' />
						) : (
							"Create"
						)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default UserListDialog;
