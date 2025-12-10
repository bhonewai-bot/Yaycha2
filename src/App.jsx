import {Item} from "./components/Item.jsx";
import {useState} from "react";
import {Form} from "./components/Form.jsx";
import {useApp} from "./ThemedApp.jsx";
import {Box, Container} from "@mui/material";
import {Header} from "./components/Header.jsx";

export default function App() {
    const [data, setData] = useState([
        { id: 1, name: "Hollow Knight", content: "Metroidvania video game" },
        { id: 2, name: "Red Dead Redemption", content: "Action-adventure game" },
        { id: 3, name: "Albion", content: "Medieval fantasy MMORPG" },
    ]);

    const { showForm } = useApp();

    const remove = (id) => {
        setData(data.filter(item => item.id !== id));
    }

    const add = (name, content) => {
        const id = data[data.length - 1] + 1;
        setData([...data, { id, name: name, content: content }])
    };

    return (
        <Box>
            <Header />

            <Container
                maxWidth="sm"
                sx={{ mt: 4 }}
            >
                {showForm && <Form add={add} /> }

                {data.map(item => (
                    <Item key={item.id} item={item} remove={remove} />
                ))}
            </Container>
        </Box>
    )
}