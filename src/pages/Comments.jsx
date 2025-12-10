import {Box, Button, TextField} from "@mui/material";
import {Item} from "../components/Item.jsx";

export function Comments() {
    return (
        <Box>
            <Item
                primary
                key={1}
                item={{
                    id: 1,
                    content: "Initial post content from Bhone Wai",
                    name: "Bhone Wai",
                }}
                remove={() => {}}
            />

            <Item
                key={2}
                item={{
                    id: 2,
                    content: "Initial post content from Boo",
                    name: "Boo",
                }}
                remove={() => {}}
            />

            <Item
                key={3}
                item={{
                    id: 3,
                    content: "A comment reply from Bhone Wai",
                    name: "Bhone Wai",
                }}
                remove={() => {}}
            />

            <form>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3, }}>
                    <TextField multiline placeholder={"Your comment"} />
                    <Button type={"submit"} variant={"contained"}>Reply</Button>
                </Box>
            </form>
        </Box>
    )
}