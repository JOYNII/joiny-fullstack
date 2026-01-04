import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (namespace: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Construct the full URL with namespace
        // Assumes the proxy handles the base path or strict separation
        // If namespace starts with '/', it is relative to the current host

        // Note: when using proxy, the client connects to window.location.origin
        // and socket.io client handles the path. 
        // We pass the namespace string directly to io()

        const socketInstance = io(namespace, {
            path: '/socket.io',
            transports: ['websocket'], // HTTP Polling 방지 (ngrok 요청 수 제한 회피)
        });

        socketInstance.on('connect', () => {
            console.log(`Connected to namespace: ${namespace}`, socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log(`Disconnected from namespace: ${namespace}`);
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [namespace]);

    return { socket, isConnected };
};
