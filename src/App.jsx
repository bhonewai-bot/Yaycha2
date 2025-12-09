import {List} from "./List.jsx";
import {Item} from "./Item.jsx";
import {useContext, useState} from "react";
import {Form} from "./Form.jsx";
import {AppContext} from "./ThemedApp.jsx";

export default function App() {
    const { mode, setMode } = useContext(AppContext);

    const [data, setData] = useState([
        { id: 1, name: "Hollow Knight", content: "Metroidvania video game" },
        { id: 2, name: "Red Dead Redemption", content: "Action-adventure game" },
        { id: 3, name: "Albion", content: "Medieval fantasy MMORPG" },
    ]);

    const [showForm, setShowForm] = useState(false);

    const remove = id => {
        setData(data.filter(item => item.id !== id));
    }

    const add = (name, content) => {
        const id = data[data.length - 1] + 1;
        setData([...data, { id, name: name, content: content }])
    };

    return (
        <div
            style={{
                minHeight: 1500,
                background: mode === "dark" ? "black" : "white",
                color: mode === "dark" ? "white" : "black",
                paddingTop: 20,
            }}
        >
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <h1
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        margin: "0 0 20px 0",
                    }}
                >
                    Foodie
                    <div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            style={{
                                width: 32,
                                height: 32,
                                borderRadius: 50,
                                border: "0 none",
                                background: showForm ? "#dc3545" : "#0d6efd",
                                color: "white"
                            }}
                        >
                            {showForm ? "×" : "+"}
                        </button>
                        <button
                            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
                            style={{
                                marginLeft: 8,
                                padding: "0 20px",
                                height: 32,
                                borderRadius: 32,
                                border: "0 none",
                                background: mode === "dark" ? "#333" : "#ddd",
                                color: mode === "dark" ? "white" : "black",
                            }}
                        >
                            {mode === "dark" ? "Light" : "Dark"}
                        </button>
                    </div>
                </h1>
                {showForm && <Form add={add} />}
                <List>
                    {data.map(item => (
                        <Item key={item.id} item={item} remove={remove} />
                    ))}
                </List>
            </div>
        </div>
    )
}