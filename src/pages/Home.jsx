import {useState} from "react";
import {Box} from "@mui/material";
import {useApp} from "../ThemedApp.jsx";
import {Form} from "../components/Form.jsx";
import {Item} from "../components/Item.jsx";

export function Home() {
    const { showForm, setGlobalMsg } = useApp();

    const [data, setData] = useState([
        { id: 3, name: "Hollow Knight", content: "Metroidvania video game" },
        { id: 2, name: "Red Dead Redemption", content: "Action-adventure game" },
        { id: 1, name: "Albion", content: "Medieval fantasy MMORPG" },
    ]);

    const add = (name, content) => {
        let id = data[0].id + 1;
        setData([{ id, name, content }, ...data ]);
        setGlobalMsg("An item added");
    }

    const remove = (id) => {
        setData(data.filter(item => item.id !== id));
        setGlobalMsg("An item deleted");
    }

    return (
        <Box>
            {showForm && (<Form add={add} />)}

            {data.map(item => (
                <Item key={item.id} item={item} remove={remove} />
            ))}
        </Box>
    )
}