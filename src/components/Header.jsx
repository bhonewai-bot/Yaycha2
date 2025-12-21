import {useApp} from "../ThemedApp.jsx";
import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";

import {
    Menu as MenuIcon,
    Add as AddIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

export function Header() {
    const { auth, showForm, setShowForm, mode, setMode, setShowDrawer } = useApp();
    const navigate = useNavigate();

    return (
        <AppBar position={"static"}>
            <Toolbar>
                <IconButton
                    color={"inherit"}
                    edge={"start"}
                    onClick={() => setShowDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>

                <Typography sx={{ flexGrow: 1, ml: 2 }}>Yaycha</Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    {auth && (
                        <IconButton
                            color="inherit"
                            onClick={() => navigate("/search")}
                        >
                            <SearchIcon />
                        </IconButton>
                    )}
                    <IconButton
                        color="inherit"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <AddIcon />
                    </IconButton>

                    {mode === "dark" ? (
                        <IconButton
                            color={"inherit"}
                            edge={"end"}
                            onClick={() => setMode("light")}
                        >
                            <LightModeIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color={"inherit"}
                            edge={"end"}
                            onClick={() => setMode("dark")}
                        >
                            <DarkModeIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}