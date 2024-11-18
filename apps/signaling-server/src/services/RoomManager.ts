import WebSocket from 'ws'
import { OutgoingMessage } from '../types/data';
import { User } from './User';
export class RoomManager {
  public rooms;

  static instance: RoomManager;
  
  constructor() {
    this.rooms = new Map<string,User[]>();
  }
  static getInstance = () => {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new RoomManager();
    return this.instance;
  };
  public addUser(roomId:string,user:User){
    if(!this.rooms.has(roomId)) 
        this.rooms.set(roomId,[])
    this.rooms.get(roomId)?.push(user)
}
public removeUser(roomId:string,user:User){
    if(!this.rooms.has(roomId)) 
        return
    this.rooms.set(roomId,this.rooms.get(roomId)?.filter((e)=>e.id!=user.id)||[])
    if(this.rooms.get(roomId)?.length===0)
        this.rooms.delete(roomId)
}
  public boardCastMessage(message: OutgoingMessage, user: User, roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.forEach((u) => {
        if (u.id !== user.id) {
            try {
                u.send(message);
            } catch (error) {
                console.error(`Failed to send message to user ${u.id}:`, error);
                this.removeUser(roomId, u);
            }
        }
    });
}
}
