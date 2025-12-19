import {
    Alarm as TimeIcon,
    AccountCircle as UserIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material";
import {Box, Card, CardContent, IconButton, Typography} from "@mui/material";
import {green} from "@mui/material/colors";
import {useNavigate} from "react-router-dom";

import { formatRelative } from "date-fns";
import {useApp} from "../ThemedApp.jsx";
import {LikeButton} from "./LikeButton.jsx";
import {CommentButton} from "./CommentButton.jsx";

export function Item({ item, remove, primary, comment, owner }) {
    const navigate = useNavigate();
    const { auth } = useApp();

    function isOwner() {
        if (!auth) return false;
        return auth.id == item.userId || auth.id == owner;
    }

    return (
        <Card sx={{ mb: 2 }}>
            {primary && <Box sx={{ height: 50, bgcolor: green[500] }} />}
            <CardContent onClick={() => {
                if (comment) return false;
                navigate(`/comments/${item.id}`);
            }}>
                <Box
                    sx={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        <TimeIcon fontSize={"10"} color={"success"} />
                        <Typography
                            variant="caption"
                            sx={{ color: green[500] }}
                        >
                            {formatRelative(item.created, new Date())}
                        </Typography>
                    </Box>

                    {isOwner() && (
                        <IconButton
                            sx={{ color: "text.fade" }}
                            size={"small"}
                            onClick={(e) => {
                                remove(item.id);
                                e.stopPropagation();
                            }}
                        >
                            <DeleteIcon color={"inherit"} fontSize={"inherit"} />
                        </IconButton>
                    )}
                </Box>

                <Typography sx={{ my: 3 }}>{item.content}</Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Box
                        onClick={e => {
                            navigate(`/profile/${item.user.id}`);
                            e.stopPropagation();
                        }}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <UserIcon fontSize={"12"} color={"info"} />
                        <Typography variant={"caption"}>{item.user.name}</Typography>
                    </Box>

                    <Box>
                        <LikeButton item={item} comment={comment} />
                        <CommentButton item={item} comment={comment} />
                    </Box>

                </Box>
            </CardContent>
        </Card>
    )
}