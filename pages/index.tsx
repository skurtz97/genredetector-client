import { useState } from "react";
import { Container, ContainerProps, Search, SearchKind } from "../components";
import { Header } from "../components";

function Index() {
    const [query, setQuery] = useState("");
    const [kind, setKind] = useState(SearchKind.Genre);


    const handleChange = () => {

    }
    return (

        <>

            <Search query={query} kind={kind} />


        </>


    )
}

export default Index;