import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/providers/Websocket";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [username, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmit = () => {
    socket?.send(
      JSON.stringify({
        type: "ROOM_JOIN",
        payload: {
          email: username,
          roomId,
        },
      })
    );
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (ev: MessageEvent) => {
        const { type } = JSON.parse(ev.data);
        if (type === "joined") {
          navigate(`/room/${roomId}`);
        }
      };
    }

    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket, roomId, navigate]);

  return (
    <section className="flex h-screen justify-center items-center">
      <Card className="flex flex-col py-10">
        <CardContent>
          <Input
            className="mb-2"
            placeholder="User name"
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserName(e.target.value);
            }}
          />
          <Input
            className="mb-2"
            placeholder="RoomID"
            type="text"
            value={roomId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setRoomId(e.target.value);
            }}
          />
          <Button onClick={handleSubmit} className="w-full">
            Join
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default Home;
