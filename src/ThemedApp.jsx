import {createContext, useContext, useState} from "react";
import App from "./App.jsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

const AppContext = createContext();

export function useApp() {
    return useContext(AppContext);
}

const theme = createTheme({
    palette: {
        mode: "dark"
    }
});

export default function ThemedApp() {
    const [showForm, setShowForm] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <AppContext.Provider value={{ showForm, setShowForm }}>
                <App />
                <CssBaseline />
            </AppContext.Provider>
        </ThemeProvider>
    )
}