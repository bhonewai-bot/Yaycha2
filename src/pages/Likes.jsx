import {Alert, Box} from "@mui/material";
import {UserList} from "./UserList.jsx";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchCommentLikes, fetchPostLikes} from "../libs/fetcher.js";


export function Likes() {
    const { id, type } = useParams();
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["users", id, type],
        queryFn: () => {
            if (type === "comment") {
                return fetchCommentLikes(id);
            } else {
                return fetchPostLikes(id);
            }
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
        )
    }

    return (
        <Box>
            <UserList title={"Likes"} data={data} />
        </Box>
    )
}