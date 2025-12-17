import {useEffect} from "react";
import {Alert, Box} from "@mui/material";
import {queryClient, useApp} from "../ThemedApp.jsx";
import {Form} from "../components/Form.jsx";
import {Item} from "../components/Item.jsx";
import {useMutation, useQuery} from "@tanstack/react-query";

const api = import.meta.env.VITE_API;

export function Home() {
    const { showForm, setGlobalMsg } = useApp();

    /*const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);*/

    const { data, isLoading, isError, error } = useQuery("posts", async () => {
        const res = await fetch(`${api}/content/posts`);
        return res.json();
    })

    useEffect(() => {
        const api = import.meta.env.VITE_API;
        fetch(`${api}/content/posts`).then(async res => {
            if (res.ok) {
                setData(await res.json());
                setLoading(false);
            } else {
                setError(true);
            }
        }).catch(() => {
            setError(true);
        })
    }, []);

    const add = (name, content) => {
        let id = data[0].id + 1;
        setData([{ id, name, content }, ...data ]);
        setGlobalMsg("An item added");
    }

    /*const remove = (id) => {
        setData(data.filter(item => item.id !== id));
        setGlobalMsg("An item deleted");
    }*/

    const remove = useMutation(
        async (id) => {
            await fetch(`${api}/content/posts/${id}`, {
                method: "DELETE",
            })
        },
        {
            onMutate: (id) => {
                queryClient.cancelQueries("posts");
                queryClient.setQueryData("posts", old => old.filter(item => item.id !== id));
                setGlobalMsg("A post deleted");
            }
        }
    )

    if (isError) {
        return (
            <Box>
                <Alert severity={"warning"}>{error.message}</Alert>
            </Box>
        )
    }

    if (isLoading) {
        return <Box sx={{ textAlign: "center" }}>Loading...</Box>
    }

    return (
        <Box>
            {showForm && (<Form add={add} />)}

            {data.map(item => (
                <Item key={item.id} item={item} remove={remove.mutate} />
            ))}
        </Box>
    )
}