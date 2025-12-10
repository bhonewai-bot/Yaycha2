import {useRef} from "react";
import {Box, Button, TextField} from "@mui/material";

export function Form({ add }) {
    const contentRef = useRef();

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                const content = contentRef.current.value;

                add("Bhone Wai", content);
                e.currentTarget.reset();
            }}
        >
            <Box sx={{ mb: 4, textAlign: "right" }}>
                <TextField
                    inputRef={contentRef}
                    type={"text"}
                    placeholder={"Content"}
                    fullWidth
                    multiline
                    sx={{ mb: 1 }}
                />
                <Button
                    variant={"contained"}
                    type={"submit"}
                >
                    Post
                </Button>
            </Box>
        </form>
    )
}