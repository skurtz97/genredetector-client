import { Table, Thead, Tr, Th, Tbody, Td, Link, Center, Spinner, TableCaption } from "@chakra-ui/react";

export function TrackTable({ items, loading }) {
  if (loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  } else if (!loading && items.length === 0) {
    return (
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Album</Th>
            <Th>Artist(s)</Th>
            <Th>Popularity</Th>
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
            <Th>Album</Th>
            <Th>Artist(s)</Th>
            <Th>Popularity</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <Link href={item.url} _hover={{ color: "green.400" }}>
                    {item.name}
                  </Link>
                </Td>
                <Td>{item.album}</Td>
                <Td>{item.artists}</Td>
                <Td isNumeric>{item.popularity}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  }
}
