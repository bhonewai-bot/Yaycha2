import {
    Favorite as LikedIcon,
        FavoriteBorder as LikeIcon
} from "@mui/icons-material";

import {useNavigate, useParams} from "react-router-dom";
import {queryClient, useApp} from "../ThemedApp.jsx";
import {Button, ButtonGroup, IconButton} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import {deleteCommentLike, deletePostLike, postCommentLike, postPostLike} from "../libs/fetcher.js";

export function LikeButton({ item, comment }) {
    const navigate = useNavigate();
    const { auth } = useApp();
    const { id } = useParams();

    function isLiked() {
        if (!auth) return false;
        if (!item.likes) return false;

        return item.likes.find(like => like.userId == auth.id);
    }

    const likePost = useMutation({
        mutationFn: async (postId) => postPostLike(postId),
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            await queryClient.cancelQueries({ queryKey: ["comments", id] });

            const previousPosts = queryClient.getQueryData(["posts"]);
            const previousComments = queryClient.getQueryData(["comments", id]);

            queryClient.setQueryData(["posts"], (old) => {
                return old?.map(post =>
                    post.id === postId
                        ? { ...post, likes: [...post.likes, { userId: auth.id }] }
                        : post
                );
            });

            if (previousComments && previousComments.id === postId) {
                queryClient.setQueryData(["comments", id], (old) => ({
                    ...old,
                    likes: [...old.likes, { userId: auth.id }]
                }));
            }

            return { previousPosts, previousComments };
        },
        onError: (err, postId, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
            }
            if (context?.previousComments) {
                queryClient.setQueryData(["comments", id], context.previousComments);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        }
    });

    const likeComment = useMutation({
        mutationFn: async (commentId) => postCommentLike(commentId),
        onMutate: async (commentId) => {
            await queryClient.cancelQueries({ queryKey: ["comments", id] });

            const previousComments = queryClient.getQueryData(["comments", id]);

            queryClient.setQueryData(["comments", id], (old) => ({
                ...old,
                comments: old.comments.map(comment =>
                    comment.id === commentId
                        ? { ...comment, likes: [...comment.likes, { userId: auth.id }] }
                        : comment
                )
            }));

            return { previousComments };
        },
        onError: (err, commentId, context) => {
            if (context?.previousComments) {
                queryClient.setQueryData(["comments", id], context.previousComments);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        }
    });

    const unlikePost = useMutation({
        mutationFn: async (postId) => deletePostLike(postId),
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            await queryClient.cancelQueries({ queryKey: ["comments", id] });

            const previousPosts = queryClient.getQueryData(["posts"]);
            const previousComments = queryClient.getQueryData(["comments", id]);

            queryClient.setQueryData(["posts"], (old) => {
                return old?.map(post =>
                    post.id === postId
                        ? { ...post, likes: post.likes.filter(like => like.userId !== auth.id) }
                        : post
                );
            });

            if (previousComments && previousComments.id === postId) {
                queryClient.setQueryData(["comments", id], (old) => ({
                    ...old,
                    likes: old.likes.filter(like => like.userId !== auth.id)
                }));
            }

            return { previousPosts, previousComments };
        },
        onError: (err, postId, context) => {
            if (context?.previousPosts) {
                queryClient.setQueryData(["posts"], context.previousPosts);
            }
            if (context?.previousComments) {
                queryClient.setQueryData(["comments", id], context.previousComments);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        }
    });

    const unlikeComment = useMutation({
        mutationFn: async (commentId) => deleteCommentLike(commentId),
        onMutate: async (commentId) => {
            await queryClient.cancelQueries({ queryKey: ["comments", id] });

            const previousComments = queryClient.getQueryData(["comments", id]);

            queryClient.setQueryData(["comments", id], (old) => ({
                ...old,
                comments: old.comments.map(comment =>
                    comment.id === commentId
                        ? { ...comment, likes: comment.likes.filter(like => like.userId !== auth.id) }
                        : comment
                )
            }));

            return { previousComments };
        },
        onError: (err, commentId, context) => {
            if (context?.previousComments) {
                queryClient.setQueryData(["comments", id], context.previousComments);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        }
    });

    return (
        <ButtonGroup>
            {isLiked() ? (
                <IconButton
                    size={"small"}
                    onClick={e => {
                        comment
                        ? unlikeComment.mutate(item.id) : unlikePost.mutate(item.id)
                        e.stopPropagation();
                    }}
                >
                    <LikedIcon fontSize={"small"} color={"error"} />
                </IconButton>
            ) : (
                <IconButton
                    onClick={e => {
                        comment
                        ? likeComment.mutate(item.id) : likePost.mutate(item.id);
                        e.stopPropagation();
                    }}
                >
                    <LikeIcon fontSize={"small"} color={"error"} />
                </IconButton>
            )}
            <Button
                onClick={e => {
                    if (comment) {
                        navigate(`/likes/${item.id}/comment`);
                    } else {
                        navigate(`/likes/${item.id}/post`);
                    }

                    e.stopPropagation();
                }}
                sx={{ color: "text.fade" }}
                variant={"text"}
                size={"small"}
            >
                {item.likes ? item.likes.length : 0}
            </Button>
        </ButtonGroup>
    );
}