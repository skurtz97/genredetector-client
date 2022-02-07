import {
  Text,
  Heading,
  Button,
  Input,
  Flex,
  Select,
  Stack,
  Spinner,
  Center,
  Table,
  Thead,
  Tr,
  Th,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { useState } from "react";
import qs from "qs";
import axios from "axios";
import ResultsTable from "./ResultsTable";
import "./App.css";

function App() {
  const [searchInput, setSearchInput] = useState({ query: "", type: "artist" });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleQueryChange = (event) => {
    setSearchInput({ query: event.target.value, type: searchInput.type });
  };
  const handleTypeChange = (event) => {
    setSearchInput({ query: searchInput.query, type: event.target.value });
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); // Stop default reloading behavior.
    console.log("Sending request...");
    setLoading(true);

    if (searchInput.type === "genre") {
      const query_str = qs.stringify({ genre: searchInput.query });
      try {
        const results = await axios.get(
          `https://genre-detector-backend-340610.uc.r.appspot.com/genres?${query_str}`
        );
        if (results.data.status === 200) {
          setSearchResults(results.data.msg);
          setLoading(false);
          console.log(results.data.msg);
        }
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    } else if (searchInput.type === "artist") {
      const query_str = qs.stringify({ name: searchInput.query });
      try {
        const results = await axios.get(
          `https://genre-detector-backend-340610.uc.r.appspot.com/artists?${query_str}`
        );
        if (results.data.status === 200) {
          setSearchResults(results.data.msg);
          setLoading(false);
          console.log(results.data.msg);
        }
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    }
  };

  const renderTable = () => {
    if (loading) {
      return (
        <Center>
          <Spinner size="xl" />
        </Center>
      );
    } else if (!loading && searchResults.length === 0) {
      return (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Popularity</Th>
              <Th>Genres</Th>
            </Tr>
          </Thead>
        </Table>
      );
    } else {
      return (
        <>
          <Heading as="h2" size="lg" textAlign="center">
            {searchResults.length} artists found
          </Heading>
          <ResultsTable items={searchResults} />
        </>
      );
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
                onChange={handleTypeChange}
              >
                <option value="artist">Artist</option>
                <option value="genre">Genre</option>
              </Select>

              <Input
                type="text"
                placeholder={
                  searchInput.type === "artist"
                    ? "Enter an artist name to search for"
                    : "Enter a genre to search for"
                }
                value={searchInput.query}
                onChange={handleQueryChange}
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

          {renderTable()}
        </Stack>
      </Flex>
    </div>
  );
}

export default App;
