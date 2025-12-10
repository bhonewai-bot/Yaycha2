import {Box, Container, Snackbar} from "@mui/material";
import {Header} from "./components/Header.jsx";
import {AppDrawer} from "./components/AppDrawer.jsx";
import {useApp} from "./ThemedApp.jsx";

import { Outlet } from "react-router-dom";

export default function Template() {
    const { globalMsg, setGlobalMsg } = useApp();

    return (
        <Box>
            <Header />
            <AppDrawer />

            <Container maxWidth={"sm"} sx={{ mt: 4 }}>
                <Outlet />
            </Container>

            <Snackbar
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom"
                }}
                open={Boolean(globalMsg)}
                onClose={() => setGlobalMsg(null)}
                autoHideDuration={6000}
                message={globalMsg}
            />
        </Box>
    )
}