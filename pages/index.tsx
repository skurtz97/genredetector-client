import { useState } from "react";
import { Input,  Select, Button } from "../components";
import type { Option } from "../components";
import styles from "../styles/index.module.css";

enum SearchKind {
    Genre = "Genre",
    Artist = "Artist",
    ArtistId = "Artist Id",
    Track = "Track",
    TrackId = "Track Id",
}

const options: Option[] = [
    {text: SearchKind.Genre, value: SearchKind.Genre},
    {text: SearchKind.Artist, value: SearchKind.Artist},
    {text: SearchKind.ArtistId, value: SearchKind.ArtistId},
    {text: SearchKind.Track, value: SearchKind.Track},
    {text: SearchKind.TrackId, value: SearchKind.TrackId},   
]


function Index() {
    const [query, setQuery] = useState("");
    const [kind, setKind] = useState(SearchKind.Genre);

    return (
        <div className={styles.search}>
        <Select options={options}/>
        <Input />
        <Button text="Search"/>
        </div>
    )
}

export default Index;