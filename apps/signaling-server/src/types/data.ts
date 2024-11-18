export interface OutgoingMessage{
    type:"user-joined"|"incoming-call" | "call-accepted"
    payload:any
}