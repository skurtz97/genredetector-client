export enum SearchKind {
    Genre,
    Artist,
    ArtistId,
    Track,
    TrackId,
}

export interface SearchProps {
    query: string;
    kind: SearchKind
}

export function Search({ query, kind }: SearchProps) {
    return (
        <>
            <select>
                <option>Genre</option>
                <option>Artist</option>
                <option>Artist Id</option>
                <option>Track</option>
                <option>Track Id</option>
            </select>
            <input type="text" />
            <button type="button" >Search</button>
        </>
    )
}