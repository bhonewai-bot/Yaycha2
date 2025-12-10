import {
    Home as HomeIcon,
    Person as ProfileIcon,
    Logout as LogoutIcon,
    PersonAdd as RegisterIcon,
    Login as LoginIcon,
} from "@mui/icons-material";
import {useApp} from "../ThemedApp.jsx";
import {
    Avatar,
    Box,
    Divider,
    Drawer, List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import {deepPurple} from "@mui/material/colors";
import {useNavigate} from "react-router-dom";

export function AppDrawer() {
    const { showDrawer, setShowDrawer, auth, setAuth } = useApp();
    const navigate = useNavigate();

    return (
        <div>
            <Drawer
                open={showDrawer}
                onClick={() => setShowDrawer(false)}
            >
                <Box
                    sx={{
                        mb: 6,
                        width: 300,
                        height: 140,
                        bgcolor: "banner",
                        position: "relative",
                    }}
                >
                    <Box
                        sx={{
                            gap: 2,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            position: "absolute",
                            left: 20,
                            bottom: -30,
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 94,
                                height: 94,
                                color: "white",
                                background: deepPurple[500]
                            }}
                        />
                        <Typography sx={{ fontWeight: "bold" }}>Bhone Wai</Typography>
                    </Box>
                </Box>
                <List>
                    <ListItem>
                        <ListItemButton onClick={() => navigate("/")}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText>Home</ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <Divider />

                    {auth && (
                        <div>
                            <ListItem>
                                <ListItemButton onClick={() => navigate("/profile/1")}>
                                    <ListItemIcon>
                                        <ProfileIcon />
                                    </ListItemIcon>
                                    <ListItemText>Profile</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton onClick={() => setAuth(null)}>
                                    <ListItemIcon>
                                        <LogoutIcon color={"error"} />
                                    </ListItemIcon>
                                    <ListItemText>Logout</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </div>
                    )}

                    {!auth && (
                        <div>
                            <ListItem>
                                <ListItemButton onClick={() => navigate("/register")}>
                                    <ListItemIcon>
                                        <RegisterIcon />
                                    </ListItemIcon>
                                    <ListItemText>Register</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton onClick={() => navigate("/login")}>
                                    <ListItemIcon>
                                        <LoginIcon />
                                    </ListItemIcon>
                                    <ListItemText>Login</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </div>
                    )}
                </List>
            </Drawer>
        </div>
    )
}