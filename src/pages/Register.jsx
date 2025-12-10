import {Alert, Box, Button, TextField, Typography} from "@mui/material";
import {useApp} from "../ThemedApp.jsx";
import {useNavigate} from "react-router-dom";

export function Register() {
    const { setAuth } = useApp();
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant={"h3"}>Register</Typography>

            <Alert severity={"warning"} sx={{ mt: 2 }}>All fields required</Alert>

            <form
                onSubmit={e => {
                    e.preventDefault();
                    setAuth(true);
                    navigate("/");
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
                    <TextField placeholder={"Name"} fullWidth/>
                    <TextField placeholder={"Username"} fullWidth/>
                    <TextField placeholder={"Bio"} fullWidth/>
                    <TextField type={"password"} placeholder={"Password"} fullWidth/>
                    <Button type={"submit"} variant={"contained"} fullWidth>
                        Register
                    </Button>
                </Box>
            </form>
        </Box>
    )
}