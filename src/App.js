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
} from "@chakra-ui/react";
import axios from "axios";
import qs from "qs";
import { useRef, useState } from "react";
import { CSVLink } from "react-csv";
import "./App.css";
import { ArtistTable } from "./ArtistTable";
import { TrackTable } from "./TrackTable";

function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("genre");
  const [displayType, setDisplayType] = useState("genre");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const csvLink = useRef();

  const handleChange = (event) => {
    if (event.target.type === "select-one") {
      setType(event.target.value);
      if (searchResults.length === 0) {
        setDisplayType(event.target.value);
      }
    } else if (event.target.type === "text") {
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
      let query_str = "";
      let id = "";
      let results = [];
      if (type === "genre") {
        console.log("GENRE");
        query_str = qs.stringify({ genre: query });
        results = await axios.get(`https://api.genredetector.com/genre?${query_str}`);
        console.log(results.data);
      } else if (type === "artist") {
        console.log("ARTIST");
        query_str = qs.stringify({ name: query });
        results = await axios.get(`https://api.genredetector.com/artists?${query_str}`);
        console.log(results.data);
      } else if (type === "artist_id") {
        console.log(query);
        if (query.includes("https://open.spotify.com/artist/")) {
          id = query.replace("https://open.spotify.com/artist/", "");
        } else if (query.indexOf(":") !== -1) {
          id = query.substring(query.lastIndexOf(":") + 1);
        } else {
          id = query;
        }

        results = await axios.get(`https://api.genredetector.com/artist/${id}`);
      } else if (type === "track") {
        console.log("TRACK");
        query_str = qs.stringify({ name: query });
        results = await axios.get(`https://api.genredetector.com/tracks?${query_str}`);
        console.log(results.data);
      } else if (type === "track_id") {
        console.log("TRACK ID");
        if (query.includes("https://open.spotify.com/track/")) {
          id = query.replace("https://open.spotify.com/track/", "");
        }
        const index = query.lastIndexOf(":");
        if (index !== -1) {
          id = query.substring(query.lastIndexOf(":") + 1); // get rest of string starting from last occurrence of :
        } else {
          id = query;
        }

        console.log(id);
        results = await axios.get(`https://api.genredetector.com/track/${id}`);
      }
      setDisplayType(type);
      setSearchResults(results.data);
      setLoading(false);
    } catch (error) {
      console.log(`Error: ${error}`);
      setLoading(false);
      console.log(searchResults);
    }
  };

  const exportToCsv = () => {
    csvLink.current.link.click();
  };
  return (
    <div className="App">
      <Flex direction="column">
        <Stack direction="column" spacing={12} w="80%" margin="0 auto">
          <Flex direction="row" justifyContent="space-between" alignItems="baseline">
            <Heading as="h1" size="3xl" textAlign="left" textTransform="uppercase" letterSpacing={4}>
              Genre Detector
            </Heading>
            <Text fontSize="xl" fontWeight="semibold">
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

          <form onSubmit={handleSubmit}>
            <Flex direction="row">
              <Select variant="filled" width="11rem" mr={2} onChange={handleChange}>
                <option value="genre">Genre</option>
                <option value="artist">Artist</option>
                <option value="artist_id">Artist (ID)</option>
                <option value="track">Track</option>
                <option value="track_id">Track (ID)</option>
              </Select>

              <InputGroup size="md">
                <Input
                  type="text"
                  placeholder={placeholderText(type)}
                  value={query}
                  onChange={handleChange}
                  alignItems="flex-start"
                  pr="8rem"
                />
                <InputRightElement width="7rem">
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
            </Flex>
          </form>
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
