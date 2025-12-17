import {Alert, Box, Button, TextField} from "@mui/material";
import {Item} from "../components/Item.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {queryClient, useApp} from "../ThemedApp.jsx";

const api = import.meta.env.VITE_API;

export function Comments() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { setGlobalMsg } = useApp();

    const { data, isLoading, isError, error } = useQuery(
        "comments",
        async (id) => {
            const res = await fetch(`${api}/content/posts/${id}`);
            return res.json();
        }
    );

    const removePost = useMutation(
        async (id) => {
            await fetch(`${api}/content/posts/${id}`, {
                method: "DELETE"
            });

            navigate("/");
            setGlobalMsg("A post deleted");
        }
    );

    const removeComment = useMutation(
        async (id) => {
            await fetch(`${api}/content/comments/${id}`, {
                method: "DELETE"
            })
        },
        {
            onMutate: (id) => {
                queryClient.cancelQueries("comments");
                queryClient.setQueryData("comments", old => {
                    old.comments = old.comments.filter(comment => {
                        comment.id !== id
                    });
                    return { ...old };
                })
                setGlobalMsg("A comment deleted");
            }
        }
    );

    if (isError) {
        return (
            <Box>
                <Alert severity={"warning"}>{error.message}</Alert>
            </Box>
        );
    }

    if (isLoading) {
        return (
            <Box sx={{ textAlign: "center" }}>Loading...</Box>
        );
    }

    return (
        <Box>
            <Item
                primary
                item={data}
                remove={removePost.mutate}
            />
            {data.comments.map(comment => (
                <Item
                    comment
                    key={comment.id}
                    item={comment}
                    remove={removeComment.mutate}
                />
            ))}

            <Item
                key={2}
                item={{
                    id: 2,
                    content: "Initial post content from Boo",
                    name: "Boo",
                }}
                remove={() => {}}
            />

            <Item
                key={3}
                item={{
                    id: 3,
                    content: "A comment reply from Bhone Wai",
                    name: "Bhone Wai",
                }}
                remove={() => {}}
            />

            <form>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3, }}>
                    <TextField multiline placeholder={"Your comment"} />
                    <Button type={"submit"} variant={"contained"}>Reply</Button>
                </Box>
            </form>
        </Box>
    )
}