import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {deepPurple, grey} from "@mui/material/colors";
import Template from "./Template.jsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";

import {Home} from "./pages/Home.jsx";
import {Login} from "./pages/Login.jsx";
import {Register} from "./pages/Register.jsx";
import {Profile} from "./pages/Profile.jsx";
import {Comments} from "./pages/Comments.jsx";
import {Likes} from "./pages/Likes.jsx";
import {Search} from "./pages/Search.jsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {fetchVerify} from "./libs/fetcher.js";
import {Notis} from "./pages/Notis.jsx";
import {AppSocket} from "./AppSocket.jsx";

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Template />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/profile/:id",
                element: <Profile />
            },
            {
                path: "/comments/:id",
                element: <Comments />
            },
            {
                path: "/likes/:id/:type",
                element: <Likes />
            },
            {
                path: "/search",
                element: <Search />
            },
            {
                path: "/notis",
                element: <Notis />
            },
        ]
    }
]);

export const queryClient = new QueryClient();

export default function ThemedApp() {
    const [mode, setMode] = useState("dark");
    const [showForm, setShowForm] = useState(false);
    const [auth, setAuth] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [globalMsg, setGlobalMsg] = useState(null);

    const theme = useMemo(() => {
        return  createTheme({
            palette: {
                mode,
                primary: deepPurple,
                banner: mode === "dark" ? grey[800] : grey[200],
                text: {
                    fade: grey[500]
                }
            },
        });
    }, [mode]);

    useEffect(() => {
        fetchVerify().then(user => {
            if (user) setAuth(user);
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <AppContext.Provider value={{ showForm, setShowForm, mode, setMode, auth, setAuth, showDrawer, setShowDrawer, globalMsg, setGlobalMsg }}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={router} />
                    <AppSocket />
                </QueryClientProvider>
                <CssBaseline />
            </AppContext.Provider>
        </ThemeProvider>
    )
}