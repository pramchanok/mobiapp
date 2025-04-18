import { io } from "socket.io-client";

const socket = io("/", {
	transports: ["websocket"],
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000
});

export default socket;
