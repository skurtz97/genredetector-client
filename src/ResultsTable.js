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
  TableCaption,
} from "@chakra-ui/react";

export function ResultsTable({ items, loading }) {
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
            <Th>Name</Th>
            <Th isNumeric>Position</Th>
            <Th isNumeric>Popularity</Th>
            <Th isNumeric>Followers</Th>
            <Th>Genres</Th>
          </Tr>
        </Thead>
        <TableCaption>No results</TableCaption>
      </Table>
    );
  } else {
    return (
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th isNumeric>Position</Th>
            <Th isNumeric>Popularity</Th>
            <Th isNumeric>Followers</Th>
            <Th>Genres</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, index) => {
            return (
              <Tr key={item.uri}>
                <Td>
                  <Link href={item.url} _hover={{ color: "green.400" }}>
                    {item.name}
                  </Link>
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
