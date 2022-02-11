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
import { useState } from "react";
import { ArtistTable } from "./ArtistTable";

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

  const handleSubmit = async (event) => {
    event.preventDefault(); // Stop default reloading behavior.
    setLoading(true);

    try {
      let query_str = "";
      let results = [];
      if (type === "genre") {
        query_str = qs.stringify({ genre: query });
        results = await axios.get(`https://api.genredetector.com/genre?${query_str}`);
      } else if (type === "artist") {
        query_str = qs.stringify({ name: query });
        results = await axios.get(`https://api.genredetector.com/artist?${query_str}`);
      } else if (type === "track") {
        query_str = qs.stringify({ name: query });
        results = await axios.get(`https://api.genredetector.com/track?${query_str}`);
      }

      setDisplayType(type);
      setSearchResults(results.data);
      console.log(results.data);
      setLoading(false);
    } catch (error) {
      console.log(`Error: ${error}`);
    }
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
                <option value="track">Track</option>
              </Select>

              <InputGroup size="md">
                <Input
                  type="text"
                  placeholder={`Enter ${type === "artist" ? "an artist" : `a ${type}`} to search for`}
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
                      <IconButton size="sm" type="button" colorScheme={"gray"} icon={<DownloadIcon />} />
                    </Tooltip>
                  </Stack>
                </InputRightElement>
              </InputGroup>
            </Flex>
          </form>
          {displayType === "track" ? (
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
