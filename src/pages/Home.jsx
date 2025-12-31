import {Alert, Box, Button, Typography, CircularProgress} from "@mui/material";
import {queryClient, useApp} from "../ThemedApp.jsx";
import {Form} from "../components/Form.jsx";
import {Item} from "../components/Item.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {deletePost, fetchFollowingPosts, fetchPosts, postPost} from "../libs/fetcher.js";
import {useState} from "react";
import {Inbox} from "@mui/icons-material";

export function Home() {
    const [showLastest, setShowLastest] = useState(true);
    const { auth, showForm, setGlobalMsg } = useApp();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["posts", showLastest],
        queryFn: () => {
            if (showLastest) return fetchPosts();
            else return fetchFollowingPosts();
        }
    });

    const add = useMutation({
        mutationFn: async (content) => postPost(content),
        onMutate: async (content) => {
            await queryClient.cancelQueries({ queryKey: ["posts", showLastest] });

            const previousPosts = queryClient.getQueryData(["posts", showLastest]);

            const tempId = `temp-${Date.now()}-${Math.random()}`;
            const tempPost = {
                id: tempId,
                content,
                user: auth,
                userId: auth.id,
                created: new Date().toISOString(),
                comments: [],
                likes: []
            };

            queryClient.setQueryData(["posts", showLastest], (old) => [tempPost, ...(old || [])]);

            return { previousPosts, tempId };
        },
        onSuccess: async (realPost, content, context) => {
            // Replace the temporary post with the real one from server
            queryClient.setQueryData(["posts", showLastest], (old) => {
                if (!old) return [realPost];
                return old.map(post => {
                    // Match by temporary ID
                    if (post.id === context.tempId) {
                        return realPost;
                    }
                    return post;
                });
            });
            setGlobalMsg("A post added");
        },
        onError: (err, content, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts", showLastest], context.previousPosts);
            }
            setGlobalMsg("Failed to add post");
        }
    });

    const remove = useMutation({
        mutationFn: async (id) => deletePost(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["posts", showLastest] });

            const previousPosts = queryClient.getQueryData(["posts", showLastest]);

            queryClient.setQueryData(["posts", showLastest], (old) =>
                old?.filter(item => item.id !== id)
            );

            return { previousPosts };
        },
        onSuccess: () => {
            setGlobalMsg("A post deleted");
        },
        onError: (err, id, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts", showLastest], context.previousPosts);
            }
            setGlobalMsg("Failed to delete post");
        }
    });

    if (isError) {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {error.message}
                </Alert>
                <Button
                    variant="outlined"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </Button>
            </Box>
        )
    }

    if (isLoading) {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2, color: "text.secondary" }}>
                    Loading posts...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {showForm && auth && <Form add={add} />}

            {auth && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 1,
                    }}
                >
                    <Button
                        disabled={showLastest}
                        onClick={() => setShowLastest(true)}
                    >
                        Latest
                    </Button>
                    <Typography sx={{ color: "text.fade", fontSize: 15 }}>
                        |
                    </Typography>
                    <Button
                        disabled={!showLastest}
                        onClick={() => setShowLastest(false)}
                    >
                        Following
                    </Button>
                </Box>
            )}

            {data.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                    <Inbox sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        {showLastest ? "No posts yet" : "No posts from people you follow"}
                    </Typography>
                    <Typography variant="body2">
                        {showLastest
                            ? "Be the first to post something!"
                            : "Follow some users to see their posts here"}
                    </Typography>
                </Box>
            ) : (
                data.map(item => (
                    <Item key={item.id} item={item} remove={remove.mutate} />
                ))
            )}
        </Box>
    );
}