import {
    Alert,
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    TextField
} from "@mui/material";
import {useState} from "react";
import { useDebounce } from "@uidotdev/usehooks";
import {useQuery} from "@tanstack/react-query";
import {fetchSearch} from "../libs/fetcher.js";
import {FollowButton} from "../components/FollowButton.jsx";
import {useNavigate} from "react-router-dom";

export function Search() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);

    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["search", debouncedQuery],
        queryFn: async () => fetchSearch(debouncedQuery)
    });

    if (isError) {
        return (
            <Box>
                <Alert severity={"warning"}>{error.message}</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <TextField
                fullWidth={true}
                variant={"outlined"}
                placeholder={"Search user"}
                onKeyUp={e => {
                    setQuery(e.target.value);
                }}
            />
            {isLoading ? (
                <Box sx={{ textAlign: "center" }}>Loading...</Box>
            ) : (
                <List>
                    {data.map(user => (
                        <ListItem key={user.id} secondaryAction={
                            <FollowButton user={user} />
                        }>
                            <ListItemButton
                                onClick={() =>
                                    navigate(`/profile/${user.id}`)
                                }>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.name}
                                    secondary={user.bio}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}