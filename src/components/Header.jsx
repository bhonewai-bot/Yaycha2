import {useApp} from "../ThemedApp.jsx";
import {AppBar, Box, IconButton, Toolbar, Typography, Badge} from "@mui/material";

import {
    Menu as MenuIcon,
    Add as AddIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    Search as SearchIcon,
    Notifications as NotiIcon,
    ArrowBack as BackIcon
} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {fetchNotis} from "../libs/fetcher.js";

export function Header() {
    const { auth, showForm, setShowForm, mode, setMode, setShowDrawer } = useApp();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["notis", auth],
        queryFn: fetchNotis
    });

    function notiCount() {
        if (!auth) return 0;
        if (isLoading || isError) return 0;

        return data.filter(noti => !noti.read).length;
    }

    return (
        <AppBar position={"static"}>
            <Toolbar>
                {pathname === "/" ? (
                    <IconButton
                        color={"inherit"}
                        edge={"start"}
                        onClick={() => setShowDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                ) : (
                    <IconButton
                        color={"inherit"}
                        edge={"start"}
                        onClick={() => navigate(-1)}
                    >
                        <BackIcon />
                    </IconButton>
                )}

                <Typography sx={{ flexGrow: 1, ml: 2 }}>Yaycha</Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    {auth && (
                        <IconButton
                            color="inherit"
                            onClick={() => setShowForm(!showForm)}
                        >
                            <AddIcon />
                        </IconButton>
                    )}

                    <IconButton
                        color="inherit"
                        onClick={() => navigate("/search")}
                    >
                        <SearchIcon />
                    </IconButton>

                    {auth && (
                        <IconButton
                            color="inherit"
                            onClick={() => navigate("/notis")}
                        >
                            <Badge
                                color="error"
                                badgeContent={notiCount()}
                            >
                                <NotiIcon />
                            </Badge>
                        </IconButton>
                    )}

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