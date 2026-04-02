// import { useAuth } from "@/context/useAuth";
// import { Client } from "@stomp/stompjs";
// import { useEffect, useRef } from "react";

// export function useWebSocket() {
//   const { token } = useAuth();
//   const clientRef = useRef<Client | null>(null);

//   useEffect(() => {
//     if (!token) return;

//     const client = new Client({
//       brokerURL: `ws://10.227.164.247:8081/ws?token=${token}`,
//       onConnect: () => {
//         console.log("WebSocket connected");
//         client.subscribe("/user/queue/messages", (message) => {
//           console.log(`Received: ${message.body}`);
//         });
//         client.publish({
//           destination: "/user/queue/messages",
//           body: "First Message",
//         });
//       },
//       onDisconnect: () => {
//         console.log("WebSocket disconnected");
//       },
//       onStompError: (frame) => {
//         console.error("STOMP error:", frame);
//       },
//     });

//     client.activate();
//     clientRef.current = client;

//     return () => {
//       client.deactivate();
//     };
//   }, [token]);

//   return clientRef;
// }
