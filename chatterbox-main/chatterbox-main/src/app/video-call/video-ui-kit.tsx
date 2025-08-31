
import { Token } from "@clerk/clerk-sdk-node";
import { useClerk } from "@clerk/nextjs";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { randomID } from "@/lib/utils";

export function getUrlParams(url = window.location.href) {
    let urlStr = url.split("?")[1];
    return new URLSearchParams(urlStr);
}

export default function VideoUIKit() {
    const roomID = getUrlParams().get("roomID") || randomID(5);
    const { user } = useClerk();
    const userid = user?.id || "";
    console.log("first",user?.id);

    let myMeeting = (element: HTMLDivElement) => {
        const initMeeting = async () => {
            
            try {
                if(user){
                    const res = await fetch(`/api/zegocloud?userId=${userid}`);
                    const { token, appID } = await res.json();  
                

                const username = user?.fullName || user?.emailAddresses[0].emailAddress.split("@")[0];
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(appID, token, roomID, user?.id!, username);
                console.log(user);
                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zp.joinRoom({
                    container: element,
                    sharedLinks: [
                        {
                            name: "Personal link",
                            url:
                                window.location.protocol +
                                "//" +
                                window.location.host +
                                window.location.pathname +
                                "?roomID=" +
                                roomID,
                        },
                    ],
                    scenario: {
                        mode: ZegoUIKitPrebuilt.GroupCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
                    },
                });
            }
            } catch (error) {
                console.error("Error initializing meeting:", error);
            }
        };
        initMeeting();
    };

    return <div className='myCallContainer' ref={myMeeting} style={{ width: "100vw", height: "100vh" }}></div>;
}
