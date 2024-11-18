import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { SocketProvider } from "./providers/Websocket";
import { PeerProvider } from "./providers/RTCPeer";
createRoot(document.getElementById("root")!).render(
  <SocketProvider>
    <PeerProvider>
      <RouterProvider router={router} />
    </PeerProvider>
  </SocketProvider>
);
