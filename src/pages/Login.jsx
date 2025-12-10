import {Alert, Box, Button, TextField, Typography} from "@mui/material";
import {useApp} from "../ThemedApp.jsx";
import {useNavigate} from "react-router-dom";

export function Login() {
    const { setAuth } = useApp();
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant={"h3"}>Login</Typography>

            <Alert severity={"warning"} sx={{ mt: 2 }}>All fields required</Alert>

            <form
                onSubmit={e => {
                    e.preventDefault();
                    setAuth(true);
                    navigate("/");
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
                    <TextField placeholder={"Username"} fullWidth />
                    <TextField type={"password"} placeholder={"Password"} fullWidth />
                    <Button type={"submit"} variant={"contained"} fullWidth>
                        Login
                    </Button>
                </Box>
            </form>
        </Box>
    )
}