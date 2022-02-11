import { useState } from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Link,
  Center,
  Spinner,
} from "@chakra-ui/react";

export function ResultsTable({ items, loading }) {
  const [counter, setCounter] = useState(0);
  const incrementCounter = () => setCounter(counter + 1);

  if (loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  } else if (!loading && items.length === 0) {
    return (
      <Table>
        <Thead>
          <Tr>
            <Th>Position</Th>
            <Th>Name</Th>
            <Th>Popularity</Th>
            <Th>Followers</Th>
            <Th>Genres</Th>
          </Tr>
        </Thead>
      </Table>
    );
  } else {
    return (
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Position</Th>
            <Th isNumeric>Popularity</Th>
            <Th isNumeric>Followers</Th>
            <Th>Genres</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <Link href={item.url}>{item.name}</Link>
                </Td>
                <Td isNumeric>{index + 1}</Td>
                <Td isNumeric>{item.popularity}</Td>
                <Td isNumeric>{item.followers.total.toLocaleString()}</Td>
                <Td>{item.genres.join(", ")}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  }
}
