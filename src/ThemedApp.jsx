import {createContext, useContext, useMemo, useState} from "react";
import App from "./App.jsx";
import {createTheme, CssBaseline, Snackbar, ThemeProvider} from "@mui/material";
import {deepPurple, grey} from "@mui/material/colors";
import {AppDrawer} from "./components/AppDrawer.jsx";

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

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

    return (
        <ThemeProvider theme={theme}>
            <AppContext.Provider value={{ showForm, setShowForm, mode, setMode, auth, setAuth, showDrawer, setShowDrawer, globalMsg, setGlobalMsg }}>
                <App />
                <AppDrawer />

                <Snackbar
                    anchorOrigin={{
                        horizontal: "center",
                        vertical: "bottom"
                    }}
                    open={Boolean(globalMsg)}
                    autoHideDuration={6000}
                    onClose={() => setGlobalMsg(null)}
                    message={globalMsg}
                />
                <CssBaseline />
            </AppContext.Provider>
        </ThemeProvider>
    )
}