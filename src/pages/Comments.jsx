import {Alert, Box, Button, TextField} from "@mui/material";
import {Item} from "../components/Item.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";
import {useNavigate, useParams} from "react-router-dom";
import {queryClient, useApp} from "../ThemedApp.jsx";
import {deleteComment, deletePost, fetchComments, postComment} from "../libs/fetcher.js";
import {useRef} from "react";

export function Comments() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { auth, setGlobalMsg } = useApp();

    const contentInput = useRef();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["comments", id],
        queryFn: async () => fetchComments(id)
    });

    const addComment = useMutation({
        mutationFn: async (content) => postComment(content, id),
        onSuccess: async (comment) => {
            await queryClient.cancelQueries({ queryKey: ["comments", id] });
            queryClient.setQueryData(["comments", id], (old) => {
                return {
                    ...old,
                    comments: [...old.comments, comment]
                };
            });
            setGlobalMsg("A comment added");
        }
    });

    const removePost = useMutation({
        mutationFn: async (id) => deletePost(id),
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["posts"] });
            navigate("/");
            setGlobalMsg("A post deleted");
        }
    });

    const removeComment = useMutation({
        mutationFn: async (id) => deleteComment(id),
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["comments", id] });
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
                    owner={data.userId}
                />
            ))}

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