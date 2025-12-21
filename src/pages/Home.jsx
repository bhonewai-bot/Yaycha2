import {Alert, Box, Button, Typography} from "@mui/material";
import {queryClient, useApp} from "../ThemedApp.jsx";
import {Form} from "../components/Form.jsx";
import {Item} from "../components/Item.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {deletePost, fetchFollowingPosts, fetchPosts, postPost} from "../libs/fetcher.js";
import {useState} from "react";

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
        onSuccess: async (post) => {
            await queryClient.cancelQueries({ queryKey: ["posts", showLastest] });
            queryClient.setQueryData(["posts"], (old) => [post, ...old]);
            setGlobalMsg("A post added");
        }
    });

    const remove = useMutation({
        mutationFn: async (id) => deletePost(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            queryClient.setQueryData(["posts", showLastest], (old) =>
                old.filter(item => item.id !== id)
            );
            setGlobalMsg("A post deleted");
        }
    });

    if (isError) {
        return (
            <Box>
                <Alert severity={"warning"}>{error.message}</Alert>
            </Box>
        )
    }

    if (isLoading) {
        return <Box sx={{ textAlign: "center" }}>Loading...</Box>
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
                        Lastest
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

            {data.map(item => (
                <Item key={item.id} item={item} remove={remove.mutate} />
            ))}
        </Box>
    )
}