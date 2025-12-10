import {Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";

export function UserList({ title }) {
    return (
        <Box>
            <Typography variant={"h4"} sx={{ mb: 3 }}>{title}</Typography>
            <List>
                <ListItem>
                    <ListItemAvatar><Avatar /></ListItemAvatar>
                    <ListItemText
                        primary={"Bhone @bhone"}
                        secondary={"Bhone's profile bio"}
                    />
                </ListItem>
            </List>
        </Box>
    )
}