import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemSecondaryAction,
    ListItemText,
    Typography
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {FollowButton} from "./FollowButton.jsx";

export function UserList({ title, data }) {
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant={"h4"} sx={{ mb: 3 }}>{title}</Typography>
            <List>
                {data.map(item => (
                    <ListItem
                        key={item.id}
                        secondaryAction={
                            <FollowButton user={item.user} />
                        }
                    >
                        <ListItemButton
                            onClick={() => navigate(`/profile/${item.user.id}`)}
                        >
                            <ListItemAvatar><Avatar /></ListItemAvatar>
                            <ListItemText
                                primary={item.user.name}
                                secondary={item.user.bio}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}