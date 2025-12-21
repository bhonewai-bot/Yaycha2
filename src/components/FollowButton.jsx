import {queryClient, useApp} from "../ThemedApp.jsx";
import {Button} from "@mui/material";
import {useMutation} from "@tanstack/react-query";
import {deleteFollow, postFollow} from "../libs/fetcher.js";

export function FollowButton({ user }) {
    const { auth } = useApp();

    function isFollowing() {
        if (!auth) return false;
        return user.following.find(item => item.followerId == auth.id);
    }

    const follow = useMutation({
        mutationFn: async (id) => postFollow(id),
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["users"] });
            await queryClient.refetchQueries({ queryKey: ["user"] });
            await queryClient.refetchQueries({ queryKey: ["search"] });
        }
    });

    const unfollow = useMutation({
        mutationFn: async (id) => deleteFollow(id),
        onSuccess: async () => {
            await queryClient.refetchQueries({ queryKey: ["users"] });
            await queryClient.refetchQueries({ queryKey: ["user"] });
            await queryClient.refetchQueries({ queryKey: ["search"] });
        }
    });

    return auth.id == user.id ? (
        <></>
    ) : (
        <Button
            size={"small"}
            edge={"end"}
            variant={isFollowing() ? "outlined" : "contained"}
            sx={{ borderRadius: 5 }}
            onClick={e => {
                if (isFollowing()) {
                    unfollow.mutate(user.id);
                } else {
                    follow.mutate(user.id);
                }
                e.stopPropagation();
            }}
        >
            {isFollowing() ? "Following" : "Follow"}
        </Button>
    );
}