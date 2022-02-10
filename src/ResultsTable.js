import { Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";

export default function ResultsTable({ items }) {
  return (
    <Table variant="striped" size="sm">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th isNumeric>Popularity</Th>
          <Th isNumeric>Followers</Th>
          <Th>Genres</Th>
        </Tr>
      </Thead>
      <Tbody>
        {items.map((item) => {
          return (
            <Tr key={item.uri}>
              <Td>{item.name}</Td>
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
