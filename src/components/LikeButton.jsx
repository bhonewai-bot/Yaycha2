import {
    Favorite as LikedIcon,
    FavoriteBorder as LikeIcon
} from "@mui/icons-material";

import {useNavigate, useParams} from "react-router-dom";
import {queryClient, useApp} from "../ThemedApp.jsx";
import {Button, ButtonGroup, CircularProgress, IconButton} from "@mui/material";
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

            const previousData = {
                postsTrue: queryClient.getQueryData(["posts", true]),
                postsFalse: queryClient.getQueryData(["posts", false]),
                comments: queryClient.getQueryData(["comments", id])
            };

            queryClient.setQueryData(["posts", true], (old) => {
                return old?.map(post =>
                    post.id === postId
                        ? { ...post, likes: [...post.likes, { userId: auth.id }] }
                        : post
                );
            });

            queryClient.setQueryData(["posts", false], (old) => {
                return old?.map(post =>
                    post.id == postId
                        ? { ...post, likes: [...post.likes, { userId: auth.id }] }
                        : post
                );
            });

            if (previousData.comments && previousData.comments.id === postId) {
                queryClient.setQueryData(["comments", id], (old) => ({
                    ...old,
                    likes: [...old.likes, { userId: auth.id }]
                }));
            }

            return previousData;
        },
        onError: (err, postId, context) => {
            if (context?.postsTrue) {
                queryClient.setQueryData(["posts", true], context.postsTrue);
            }
            if (context?.postsFalse) {
                queryClient.setQueryData(["posts", false], context.postsFalse);
            }
            if (context?.comments) {
                queryClient.setQueryData(["comments", id], context.comments);
            }
        },
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
    });

    const unlikePost = useMutation({
        mutationFn: async (postId) => deletePostLike(postId),
        onMutate: async (postId) => {
            await queryClient.cancelQueries({ queryKey: ["posts"] });
            await queryClient.cancelQueries({ queryKey: ["comments", id] });

            const previousData = {
                postsTrue: queryClient.getQueryData(["posts", true]),
                postsFalse: queryClient.getQueryData(["posts", false]),
                comments: queryClient.getQueryData(["comments", id])
            };

            queryClient.setQueryData(["posts", true], (old) => {
                return old?.map(post =>
                    post.id === postId
                        ? { ...post, likes: post.likes.filter(like => like.userId !== auth.id) }
                        : post
                );
            });

            queryClient.setQueryData(["posts", false], (old) => {
                return old?.map(post =>
                    post.id === postId
                        ? { ...post, likes: post.likes.filter(like => like.userId !== auth.id) }
                        : post
                );
            });

            if (previousData.comments && previousData.comments.id === postId) {
                queryClient.setQueryData(["comments", id], (old) => ({
                    ...old,
                    likes: old.likes.filter(like => like.userId !== auth.id)
                }));
            }

            return previousData;
        },
        onError: (err, postId, context) => {
            if (context?.postsTrue) {
                queryClient.setQueryData(["posts", true], context.postsTrue);
            }
            if (context?.postsFalse) {
                queryClient.setQueryData(["posts", false], context.postsFalse);
            }
            if (context?.comments) {
                queryClient.setQueryData(["comments", id], context.comments);
            }
        },
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
    });

    const isLoading = likePost.isPending || likeComment.isPending ||
        unlikePost.isPending || unlikeComment.isPending;

    return (
        <ButtonGroup>
            {isLiked() ? (
                <IconButton
                    size={"small"}
                    disabled={isLoading}
                    onClick={e => {
                        comment
                            ? unlikeComment.mutate(item.id)
                            : unlikePost.mutate(item.id);
                        e.stopPropagation();
                    }}
                >
                    <LikedIcon fontSize={"small"} color={"error"} />
                </IconButton>
            ) : (
                <IconButton
                    size={"small"}
                    disabled={isLoading}
                    onClick={e => {
                        comment
                            ? likeComment.mutate(item.id)
                            : likePost.mutate(item.id);
                        e.stopPropagation();
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={20} />
                    ) : (
                        <LikeIcon fontSize={"small"} color={"error"} />
                    )}
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