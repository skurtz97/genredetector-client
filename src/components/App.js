import { DownloadIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Text,
  Tooltip,
  Link,
  Divider
} from "@chakra-ui/react";
import axios from "axios";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import "../styles/App.css";
import { ArtistTable } from "./ArtistTable";
import { TrackTable } from "./TrackTable";


const DEV_URL = "https://go-backend-dot-genre-detector-backend-340610.uc.r.appspot.com"
const PROD_URL = "https://go-backend-dot-genre-detector-backend-340610.uc.r.appspot.com"
let BASE_URL = ""
if (process.env.NODE_ENV === "development") {
  BASE_URL = DEV_URL
} else {
  BASE_URL = PROD_URL
}


function artistSimplify(artist) {
  return {
    name: artist.name,
    id: artist.id,
    genres: artist.genres,
    followers: artist.followers.total,
    popularity: artist.popularity,
    external_urls: artist.external_urls.spotify
  };
}

function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("genre");
  const [exact, setExact] = useState(true)
  const [displayType, setDisplayType] = useState("genre");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [length, setLength] = useState(0);
  const csvLink = useRef();
  const [elapsed, setElapsed] = useState(0);

  const handleChange = (event) => {

    const value = event.target.value;

    if (event.target.type === "select-one") {
      if (value === "genre" || value === "artist" || value === "artist_id" || value === "track" || value === "track_id") {
        setType(event.target.value);
        if (searchResults.length === 0) {
          setDisplayType(event.target.value);
        }
      }
      else if (event.target.value === "exact") {
        setExact(true)
      }
      else if (event.target.value === "all") {
        setExact(false)
      }
    }
    else if (event.target.type === "text") {
      setQuery(event.target.value);
    }
  };

  const placeholderText = (type) => {
    switch (type) {
      case "genre":
        return "Enter a genre to search for";
      case "artist":
        return "Enter an artist to search for";
      case "artist_id":
        return "Enter an artist id to search for";
      case "track":
        return "Enter a track to search for";
      case "track_id":
        return "Enter a track id to search for";
      default:
        return "Enter a genre to search for";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Stop default reloading behavior.
    setLoading(true);


    try {
      let id = "";
      let results = [];
      let searchQuery = query.replace(/  +/g, " ").trim()
      if (type === "genre") {
        if (exact) {
          const requestedAt = performance.now();
          results = await axios.get(`${BASE_URL}/search/genre?q=${searchQuery}`);
          results.data.items = results.data.items.map((artist) => artistSimplify(artist));
          const receivedAt = performance.now();
          setElapsed(receivedAt - requestedAt);
        }
        else {
          const requestedAt = performance.now()
          results = await axios.get(`${BASE_URL}/search/genre?q=${searchQuery}&partial=true`)
          results.data.items = results.data.items.map((artist) => artistSimplify(artist));
          const receivedAt = performance.now();
          setElapsed(receivedAt - requestedAt);
        }

      } else if (type === "artist") {
        const requestedAt = performance.now();
        results = await axios.get(`${BASE_URL}/search/artist?q=${searchQuery}`);
        results.data.items = results.data.items.map((artist) => artistSimplify(artist));
        const receivedAt = performance.now();
        setElapsed(receivedAt - requestedAt);
      } else if (type === "artist_id") {
        if (query.includes("https://open.spotify.com/artist/")) {
          id = query.replace("https://open.spotify.com/artist/", "");
        } else if (query.indexOf(":") !== -1) {
          id = query.substring(query.lastIndexOf(":") + 1);
        } else {
          id = query;
        }
        const requestedAt = performance.now();
        results = await axios.get(`${BASE_URL}/search/artist/${id}`);
        results.data.followers = results.data.followers.total;
        const receivedAt = performance.now();
        setElapsed(receivedAt - requestedAt);
        results = {
          data: [].concat([results.data])
        }
      } else if (type === "track") {
        const requestedAt = performance.now();
        results = await axios.get(`${BASE_URL}/search/track?q=${searchQuery}`);
        const receivedAt = performance.now();
        setElapsed(receivedAt - requestedAt);
        results.data.items = results.data.items.map(((track) => {
          return (
            {
              name: track.name,
              album: {
                name: track.album.name,
                release_date: new Date(track.album.release_date).toLocaleDateString("en-US")
              },
              artists: track.artists.map(artist => artist.name).join(", "),
              popularity: track.popularity,
              external_urls: track.external_urls.spotify
            }
          )
        }))
      }
      else if (type === "track_id") {
        if (query.includes("https://open.spotify.com/track/")) {
          id = query.replace("https://open.spotify.com/track/", "");
        } else if (query.indexOf(":") !== -1) {
          id = query.substring(query.lastIndexOf(":") + 1);
        } else {
          id = query;
        }
        const requestedAt = performance.now();
        results = await axios.get(`${BASE_URL}/search/track/${id}`);
        const receivedAt = performance.now();
        setElapsed(receivedAt - requestedAt);

        results = {
          data: [].concat([{
            name: results.data.name,
            album: {
              name: results.data.album.name,
              release_date: new Date(results.data.album.release_date).toLocaleDateString("en-US")
            },
            artists: results.data.artists.map(artist => artist.name).join(", "),
            popularity: results.data.popularity,
            external_urls: results.data.external_urls.spotify
          }])
        }
      }
      setDisplayType(type);
      if (type === "artist_id" || type === "track_id") {
        console.log(results.data);
        setSearchResults(results.data);
        setTotal(results.data.length);
        setLength(results.data.length);
      } else {
        console.log(results.data);
        setSearchResults(results.data.items);
        setTotal(results.data.total);
        setLength(results.data.length);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const exportToCsv = () => {
    csvLink.current.link.click();
  };
  return (
    <div className="App">
      <Flex direction="column">
        <Stack direction="column" spacing={12} w="90%" margin="0 auto">

          <Flex direction={["column", "column", "column", "row"]} justifyContent={["center", "center", "space-between", "space-between"]} alignItems={["center", "center", "center", "baseline"]} flexWrap={["wrap", "wrap", "nowrap", "nowrap"]} >
            <Heading as="h1" fontSize={["xl", "2xl", "3xl", "5xl"]} textAlign={["center", "center", "left", "left"]} textTransform="uppercase" letterSpacing={3}>
              Genre Detector
            </Heading>
            <Text fontSize={["sm", "md", "md", "xl"]} fontWeight="semibold">
              Please support Friends To The End with your{" "}
              <Link
                textColor="blue.400"
                _hover={{ textColor: "blue.300", textDecoration: "underline" }}
                href="https://open.spotify.com/artist/7iSfLI1iAcghpThO7zwHjC?si=-XOa-mTmTI6JKQpz9tHwaw&nd=1"
              >
                follow on Spotify.
              </Link>
            </Text>
          </Flex>


          <Divider style={{ "marginTop": "1rem" }} />
          <form onSubmit={handleSubmit}>
            <Flex direction={["column", "column", "row", "row"]} alignItems={["normal", "normal", "center", "center"]} justifyContent={["center"]}>
              {type === "genre" ? (
                <Flex direction="row" mr={2} justifyContent={["flex-start", "flex-start", "space-between", "space-between"]} mb={[2, 2, 0, 0]} alignItems="center">
                  <Select variant="filled" width="8rem" onChange={handleChange} mr={2}  >
                    <option value="genre">Genre</option>
                    <option value="artist">Artist</option>
                    <option value="artist_id">Artist (ID)</option>
                    <option value="track">Track</option>
                    <option value="track_id">Track (ID)</option>
                  </Select>
                  <Tooltip label={(exact ? "Include only exact matches" : "Include all matches")}>
                    <Select variant="filled" width="8rem" onChange={handleChange} >
                      <option value="exact">Exact</option>
                      <option value="all">Partial</option>
                    </Select>
                  </Tooltip>
                </Flex>
              ) : (
                <Flex direction="row" mr={0} justifyContent="space-between" alignItems="center" mb={[2, 2, 0, 0]}>
                  <Select variant="filled" width="8rem" onChange={handleChange} mr={2} >
                    <option value="genre">Genre</option>
                    <option value="artist">Artist</option>
                    <option value="artist_id">Artist (ID)</option>
                    <option value="track">Track</option>
                    <option value="track_id">Track (ID)</option>
                  </Select>

                </Flex>
              )}

              <InputGroup size="md">
                <Input
                  type="text"
                  placeholder={placeholderText(type)}
                  value={query}
                  onChange={handleChange}
                  alignItems="flex-start"
                  pr="8rem"
                />
                <InputRightElement width={["6rem", "6rem", "7rem", "7rem"]} visibility={["hidden", "hidden", "visible", "visible"]} mr="0.5rem">
                  <Stack width="100%" direction="row">
                    <Button type="submit" colorScheme={"green"} size="sm">
                      Search
                    </Button>
                    <Tooltip label="Download as CSV">
                      <IconButton
                        size="sm"
                        type="button"
                        colorScheme={"gray"}
                        icon={<DownloadIcon />}
                        onClick={exportToCsv}
                      />
                    </Tooltip>
                    <CSVLink data={searchResults} filename="spotify_search.csv" hidden ref={csvLink} target="_blank" />
                  </Stack>
                </InputRightElement>
              </InputGroup>
              <Button type="submit" colorScheme={"green"} size="md" width={["8rem", "8rem", "0rem", "0rem"]} mt={2} visibility={["visible", "visible", "hidden", "hidden"]}>
                Search
              </Button>
            </Flex>
          </form>
          <Text textAlign="left">{`Server found ${total} results and sent ${length} to client. It took ${elapsed.toFixed(0) }ms to receive a response.`}</Text>
          {displayType === "track" || displayType === "track_id" ? (
            <TrackTable items={searchResults} loading={loading} />
          ) : (
            <ArtistTable items={searchResults} loading={loading} />
          )}
        </Stack>
      </Flex>
    </div>
  );
}

export default App;
