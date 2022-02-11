import {
  Text,
  Heading,
  Button,
  Input,
  Flex,
  Select,
  Stack,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { ResultsTable } from "./ResultsTable";

import qs from "qs";
import axios from "axios";

import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("genre");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    if (event.target.type === "select-one") {
      console.log(`Changing search type to ${event.target.value}`);
      setType(event.target.value);
    } else if (event.target.type === "text") {
      console.log(`Changing search query to ${event.target.value}`);
      setQuery(event.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Stop default reloading behavior.
    console.log("Sending request...");
    setLoading(true);

    if (type === "genre") {
      const query_str = qs.stringify({ genre: query });
      try {
        const results = await axios.get(
          `https://api.genredetector.com/genres?${query_str}`
        );
        if (results.data.status === 200) {
          setSearchResults(results.data.msg);
          setLoading(false);
          console.log(results.data.msg);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else if (type === "artist") {
      const query_str = qs.stringify({ name: query });
      try {
        const results = await axios.get(
          `https://api.genredetector.com/artists?${query_str}`
        );
        if (results.data.status === 200) {
          setSearchResults(results.data.msg);
          setLoading(false);
          console.log(results.data.msg);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="App">
      <Flex direction="column" mt={4}>
        <Stack direction="column" spacing="2rem" w="80%" margin="0 auto">
          <Heading
            as="h1"
            size="4xl"
            textAlign="left"
            textTransform="uppercase"
            textShadow="md"
            letterSpacing={4}
          >
            GENRE DETECTOR
          </Heading>

          <form onSubmit={handleSubmit}>
            <Flex direction="row">
              <Select
                variant="filled"
                width="11rem"
                mr={2}
                onChange={handleChange}
              >
                <option value="genre">Genre</option>
                <option value="artist">Artist</option>
              </Select>

              <Input
                type="text"
                placeholder={
                  type === "genre"
                    ? "Enter a genre to search for"
                    : "Enter an artist to search for"
                }
                value={query}
                onChange={handleChange}
                alignItems="flex-start"
              ></Input>
            </Flex>

            <Flex
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              width="40%"
              margin="0 auto"
              mt={2}
            >
              <Button type="submit" colorScheme={"green"} width="16rem" mr={2}>
                Search
              </Button>
              <Tooltip label="Download as CSV">
                <IconButton
                  type="button"
                  colorScheme={"gray"}
                  aria-label="Download as CSV"
                  width="4rem"
                  icon={<DownloadIcon />}
                />
              </Tooltip>
            </Flex>
          </form>
          <ResultsTable items={searchResults} loading={loading} />
        </Stack>
      </Flex>
    </div>
  );
}

export default App;
