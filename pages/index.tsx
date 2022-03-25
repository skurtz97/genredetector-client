import { Input, Select, Button, Table } from "../components";
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
    { text: SearchKind.Genre, value: SearchKind.Genre },
    { text: SearchKind.Artist, value: SearchKind.Artist },
    { text: SearchKind.ArtistId, value: SearchKind.ArtistId },
    { text: SearchKind.Track, value: SearchKind.Track },
    { text: SearchKind.TrackId, value: SearchKind.TrackId },
]


type Artist = {
    name: string
    popularity: number
    genres: string[]
}


const data: Artist[] = [
    { name: "Daft Punk", popularity: 32, genres: ["electro house", "pop electronica", "disco"] },
    { name: "Elton John", popularity: 29, genres: ["soft rock", "rock", "british rock", "chamber pop"] },
    { name: "Pilotpriest", popularity: 6, genres: ["exotic house", "electronica", "pop fusion chill"] }
]





function Index() {


    return (
        <div>
            <div className={styles.search}>
                <Select options={options} />
                <Input />
                <Button text="Search" />
            </div>
            <div>
                <Table columns={["name", "popularity", "genres"]} data={data} />
            </div>
        </div>

    )
}

export default Index;