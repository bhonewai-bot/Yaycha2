import {queryClient, useApp} from "./ThemedApp.jsx";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {useEffect} from "react";

export function AppSocket() {
    const { auth } = useApp();

    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(import.meta.env.VITE_WS);

    useEffect(() => {
        if (auth && readyState == ReadyState.OPEN) {
            sendJsonMessage({
                token: localStorage.getItem("token"),
            });

            console.log("WS: connection ready & token sent");
        }
    }, [readyState, auth, sendJsonMessage]);

    useEffect(() => {
        console.log("WS: new message received", lastJsonMessage);

        if (lastJsonMessage && lastJsonMessage.event) {
            const event = lastJsonMessage.event;
            const postId = lastJsonMessage.postId;

            if (event === "notis") {
                console.log("WS: Invalidating notifications");
                queryClient.invalidateQueries({
                    queryKey: ["notis"],
                    exact: false
                });
            } else if (event === "posts") {
                console.log("WS: Invalidating posts");
                queryClient.invalidateQueries({
                    queryKey: ["posts"],
                    exact: false
                });
            } else if (event === "comments" && postId) {
                console.log(`WS: Invalidating comments for post ${postId}`);
                queryClient.invalidateQueries({
                    queryKey: ["comments", String(postId)],
                    exact: true
                });
            } else {
                console.log(`WS: Invalidating ${event}`);
                queryClient.invalidateQueries({
                    queryKey: [event],
                    exact: false
                });
            }
        }
    }, [lastJsonMessage]);

    return <></>;
}