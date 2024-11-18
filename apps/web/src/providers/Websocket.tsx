import React from "react";
const SocketContext = React.createContext<null|WebSocket>(null)

export const useSocket = ()=>{
    return React.useContext(SocketContext)
}
export const SocketProvider = ({children}:{children:React.ReactNode})=>{
    const socket = React.useMemo(()=>{ return new WebSocket("http://localhost:8000")
    },[] ) 
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}