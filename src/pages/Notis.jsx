import {Alert, Avatar, Box, Button, Card, CardActionArea, CardContent, Typography} from "@mui/material";
import {
    Comment as CommentIcon,
    Favorite as FavoriteIcon,
} from "@mui/icons-material";

import { format } from "date-fns";
import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchNotis, putAllNotisRead, putNotiRead} from "../libs/fetcher.js";
import {useNavigate} from "react-router-dom";
import {queryClient, useApp} from "../ThemedApp.jsx";

export function Notis() {
    const { auth } = useApp();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["notis", auth],
        queryFn: fetchNotis
    });

    const navigate = useNavigate();

    const readAllNotis = useMutation({
        mutationFn: putAllNotisRead,
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["notis", auth] });

            const previousNotis = queryClient.getQueryData(["notis", auth]);

            const updatedNotis = previousNotis?.map(noti => ({
                ...noti,
                read: true
            }));

            queryClient.setQueryData(["notis", auth], updatedNotis);

            return { previousNotis };
        },
        onError: (err, variables, context) => {
            if (context?.previousNotis) {
                queryClient.setQueryData(["notis", auth], context.previousNotis);
            }
        }
    });

    const readNoti = useMutation({
        mutationFn: (id) => putNotiRead(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["notis", auth] });

            const previousNotis = queryClient.getQueryData(["notis", auth]);

            const updatedNotis = previousNotis?.map(noti =>
                noti.id === id
                    ? { ...noti, read: true }
                    : noti
            );

            queryClient.setQueryData(["notis", auth], updatedNotis);

            return { previousNotis };
        },
        onError: (err, id, context) => {
            if (context?.previousNotis) {
                queryClient.setQueryData(["notis", auth], context.previousNotis);
            }
        },
        onSuccess: () => {
            console.log("Notification marked as read successfully");
        }
    })

    if (isError) {
        return (
            <Box>
                <Alert severity="warning">{error.message}</Alert>
            </Box>
        );
    }

    if (isLoading) {
        return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
    }

    return (
        <Box>
            <Box sx={{ display: "flex", mb: 2 }}>
                <Box sx={{ flex: 1 }}></Box>
                <Button
                    size="small"
                    variant="outlined"
                    sx={{ borderRadius: 5 }}
                    onClick={() => {
                        readAllNotis.mutate();
                    }}
                >
                    Mark all as read
                </Button>
            </Box>

            {data.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                    <FavoriteIcon sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        No notifications yet
                    </Typography>
                    <Typography variant="body2">
                        You'll see notifications here when someone likes or comments on your posts
                    </Typography>
                </Box>
            ) : (
                data.map(noti => {
                    return (
                        <Card
                            sx={{ mb: 2, opacity: noti.read ? 0.3 : 1 }}
                            key={noti.id}
                        >
                            <CardActionArea
                                onClick={async () => {
                                    await readNoti.mutateAsync(noti.id);
                                    navigate(`/comments/${noti.postId}`);
                                }}
                            >
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        opacity: 1,
                                    }}
                                >
                                    {noti.type == "comment" ? (
                                        <CommentIcon color={"success"} />
                                    ) : (
                                        <FavoriteIcon color={"error"} />
                                    )}

                                    <Box sx={{ ml: 3 }}>
                                        <Avatar />

                                        <Box sx={{ mt: 1 }}>
                                            <Typography
                                                component="span"
                                                sx={{ mr: 1 }}
                                            >
                                                <b>{noti.user.name}</b>
                                            </Typography>

                                            <Typography
                                                component="span"
                                                sx={{
                                                    mr: 1,
                                                    color: "text.secondary",
                                                }}
                                            >
                                                {noti.content}
                                            </Typography>

                                            <Typography
                                                component={"span"}
                                                color={"primary"}
                                            >
                                                <small>
                                                    {format(noti.created, "MMM dd, yyyy") }
                                                </small>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )
                })
            )}
        </Box>
    )
}