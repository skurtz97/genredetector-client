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
import { ResultsTable } from "./ResultsTable";

import qs from "qs";
import axios from "axios";

import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("genre");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (event) => {
    if (event.target.type === "select-one") {
      setType(event.target.value);
    } else if (event.target.type === "text") {
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
      <Flex direction="column">
        <Stack direction="column" spacing={12} w="80%" margin="0 auto">
          <Heading
            as="h1"
            size="3xl"
            textAlign="left"
            textTransform="uppercase"
            letterSpacing={4}
          >
            Genre Detector
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

              <InputGroup size="md">
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
                      />
                    </Tooltip>
                  </Stack>
                </InputRightElement>
              </InputGroup>
            </Flex>
          </form>
          <ResultsTable items={searchResults} loading={loading} />
        </Stack>
      </Flex>
    </div>
  );
}

export default App;
