import {
  Heading,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  Select,
  Stack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { useState, useRef } from "react";
import { ArtistTable } from "./ArtistTable";
import { CSVLink } from "react-csv";

import qs from "qs";
import axios from "axios";

import "./App.css";
import { TrackTable } from "./TrackTable";

function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("genre");
  const [displayType, setDisplayType] = useState("genre");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
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
        results = await axios.get(`http://localhost:8080/genre?${query_str}`);
        console.log(results.data);
      } else if (type === "artist") {
        query_str = qs.stringify({ name: query });
        results = await axios.get(`http://localhost:8080/artists?${query_str}`);
        console.log(results.data);
      } else if (type === "artist_id") {
        const index = query.lastIndexOf(":");
        if (index !== -1) {
          id = query.substring(query.lastIndexOf(":") + 1); // get rest of string starting from last occurrence of :
        } else {
          id = query;
        }
        results = await axios.get(`http://localhost:8080/artist/${id}`);
      } else if (type === "track") {
        query_str = qs.stringify({ name: query });
        results = await axios.get(`http://localhost:8080/tracks?${query_str}`);
        console.log(results.data);
      } else if (type === "track_id") {
        const index = query.lastIndexOf(":");
        if (index !== -1) {
          id = query.substring(query.lastIndexOf(":") + 1); // get rest of string starting from last occurrence of :
        } else {
          id = query;
        }
        results = await axios.get(`http://localhost:8080/track/${id}`);
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
          <Heading as="h1" size="3xl" textAlign="left" textTransform="uppercase" letterSpacing={4}>
            Genre Detector
          </Heading>

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
