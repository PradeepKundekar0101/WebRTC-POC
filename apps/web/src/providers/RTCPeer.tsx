import React, { useContext, useMemo } from "react";
interface PeerContextType {
  peer: RTCPeerConnection;
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
}
const PeerContext = React.createContext<PeerContextType | null>(null);

export const usePeer = (): PeerContextType => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }
  return context;
};


export const PeerProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3278"
          ]
        }
      ]
    });
  }, []);

  const createOffer = async (): Promise<RTCSessionDescriptionInit> => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit> => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const contextValue: PeerContextType = {
    peer,
    createOffer,
    createAnswer
  };

  return (
    <PeerContext.Provider value={contextValue}>
      {children}
    </PeerContext.Provider>
  );
};