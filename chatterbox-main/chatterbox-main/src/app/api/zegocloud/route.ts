import { generateKey } from "crypto";
import { generateToken04 } from "./zegoServerAssistant";
import { use } from "react";


export async function GET(req:Request){
    const url  = new URL(req.url);
    const userID = url.searchParams.get("userId") || "";
    console.log("i get userId",userID);
    // + because to convert to number
    const appID = +process.env.NEXT_PUBLIC_ZEGO_APP_ID!;
    const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;

    const effectiveTimeInSeconds = 3600;
    const payload = "";
    // if(userID){
        const token = await generateToken04(appID,userID,serverSecret,effectiveTimeInSeconds,payload);
        return Response.json({token,appID});
    // }

}
