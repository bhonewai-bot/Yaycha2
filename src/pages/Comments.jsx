import {Alert, Box, Button, TextField} from "@mui/material";
import {Item} from "../components/Item.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {queryClient, useApp} from "../ThemedApp.jsx";
import {fetchComments, postComment} from "../libs/fetcher.js";
import {useRef} from "react";

const api = import.meta.env.VITE_API;

export function Comments() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { auth, setGlobalMsg } = useApp();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["comments", id],
        queryFn: async () => fetchComments(id)
    });

    console.log(data);

    const contentInput = useRef();

    const removePost = useMutation({
        mutationFn: async (id) => {
            await fetch(`${api}/content/posts/${id}`, {
                method: "DELETE"
            });

            navigate("/");
            setGlobalMsg("A post deleted");
        }
    });

    const addComment = useMutation({
        mutationFn: async (content) => postComment(content, id),
        onSuccess: async (comment) => {
            await queryClient.cancelQueries({ queryKey: ["comments"] });
            queryClient.setQueryData(["comments"], (old) => {
                return {
                    ...old,
                    comments: [...old.comments, comment]
                };
            });
            setGlobalMsg("A comment added");
        }
    });

    const removeComment = useMutation({
        mutationFn: async (id) => {
            await fetch(`${api}/content/comments/${id}`, {
                method: "DELETE"
            });
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["comments"] });
            queryClient.setQueryData(["comments"], (old) => {
                return {
                    ...old,
                    comments: old.comments.filter(comment => comment.id !== id)
                };
            });
            setGlobalMsg("A comment deleted");
        }
    });

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

            {auth && (
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        const content = contentInput.current.value;
                        if (!content) return false;

                        addComment.mutate(content);

                        e.currentTarget.reset();
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3, }}>
                        <TextField inputRef={contentInput} multiline placeholder={"Your comment"} />
                        <Button type={"submit"} variant={"contained"}>Reply</Button>
                    </Box>
                </form>
            )}
        </Box>
    )
}