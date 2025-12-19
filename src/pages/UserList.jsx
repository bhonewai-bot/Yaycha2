import {Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

export function UserList({ title, data }) {
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant={"h4"} sx={{ mb: 3 }}>{title}</Typography>
            <List>
                {data.map(item => (
                    <ListItem key={item.id}>
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
                {/*<ListItem>
                    <ListItemAvatar><Avatar /></ListItemAvatar>
                    <ListItemText
                        primary={"Bhone @bhone"}
                        secondary={"Bhone's profile bio"}
                    />
                </ListItem>*/}
            </List>
        </Box>
    )
}