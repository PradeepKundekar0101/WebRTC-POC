import { useSocket } from "@/providers/Websocket";
import { usePeer } from "@/providers/RTCPeer";
import { useEffect } from "react";

const Room = () => {
  const socket = useSocket();
  const peer = usePeer();
  const newUserJoined = async(emailId:string)=>{
    const offer = await peer.createOffer();
    socket?.send(
      JSON.stringify({
        type: "CREATE_OFFER",
        payload: { offer, emailId },
      })
    );
  }
  const handleIncomingCall = async(email:string,offer:any)=>{
      const answer = peer.createAnswer(offer);
      socket?.send(JSON.stringify({
        type:"CREATE_ANSWER",
        payload:{answer,email}
      }))
  }
  useEffect(() => {
    if (socket) {
      socket.onmessage = async (ev: MessageEvent) => {
        const { type, payload } = JSON.parse(ev.data);
        if (type === "user-joined") {
          newUserJoined(payload.email)
        }
        if(type === "incoming-call"){
            const {email,offer} = payload;
            handleIncomingCall(email,offer)
        }
      };
    }

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket]);
  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
};

export default Room;
