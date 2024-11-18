import WebSocket from "ws";
import { RoomManager } from "./RoomManager";
import crypto from "crypto";
import { OutgoingMessage } from "../types/data";
export class User {
  public id: string;
  public email: string = "";
  public roomId: string = "";
  constructor(private ws: WebSocket) {
    this.id = crypto.randomUUID();
  }
  send(payload: OutgoingMessage) {
    this.ws.send(JSON.stringify(payload));
  }
  initHandler = () => {
    this.ws.on("message", (data) => {
      const { type, payload } = JSON.parse(data.toString());
      switch (type) {
        case "ROOM_JOIN":
          const { roomId, email } = payload;
          this.email = email;
          this.roomId = roomId;
          const outgoingMessage: OutgoingMessage = {
            type: "user-joined",
            payload: {
              email,
            },
          };
          RoomManager.getInstance().addUser(roomId, this);
          RoomManager.getInstance().boardCastMessage(
            outgoingMessage,
            this,
            this.roomId
          );
          this.ws.send(
            JSON.stringify({
              type: "joined",
              payload: RoomManager.getInstance()
                .rooms.get(roomId)
                ?.map((e) => e.email),
            })
          );
          break;
        case "CREATE_OFFER":
            const { offer, email:emailId } = payload;
            if(this.email==emailId){
                RoomManager.getInstance().boardCastMessage({
                    type:"incoming-call",
                    payload:this.email
                },this,this.roomId)
            }
            // RoomManager.getInstance().socketIdEmailMap
        case "CALL_ACCEPTED":
        }

    });
  };
}
