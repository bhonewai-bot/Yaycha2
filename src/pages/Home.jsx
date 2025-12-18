import {Alert, Box} from "@mui/material";
import {queryClient, useApp} from "../ThemedApp.jsx";
import {Form} from "../components/Form.jsx";
import {Item} from "../components/Item.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchPosts, postPost} from "../libs/fetcher.js";

const api = import.meta.env.VITE_API;

export function Home() {
    const { auth, showForm, setGlobalMsg } = useApp();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["posts"],
        queryFn: fetchPosts
    });

    const add = useMutation({
        mutationFn: async (content) => postPost(content),
        onSuccess: async (post) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            queryClient.setQueryData(["posts"], (old) => [post, ...old]);
            setGlobalMsg("A post added");
        }
    });

    const remove = useMutation({
        mutationFn: async (id) => {
            await fetch(`${api}/content/posts/${id}`, {
                method: "DELETE",
            });
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            queryClient.setQueryData(["posts"], (old) =>
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

            {data.map(item => (
                <Item key={item.id} item={item} remove={remove.mutate} />
            ))}
        </Box>
    )
}