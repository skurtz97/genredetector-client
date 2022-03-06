import { Table, Thead, Tr, Th, Tbody, Td, Link, Center, Spinner, TableCaption } from "@chakra-ui/react";

export function TrackTable({ items, loading }) {
  if (loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  } else if ((!loading && items.length === 0) || (!loading && !items) || (!loading && items[0].artists === null)){
    return (
      <Table variant="striped" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Album</Th>
            <Th>Artist(s)</Th>
            <Th>Release Date</Th>
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
            <Th>Released</Th>
            <Th>Popularity</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, index) => {
            return (
              <Tr key={index}>
                <Td>
                  <Link href={item.external_urls} _hover={{ color: "green.400" }} target="_blank">
                    {item.name}
                  </Link>
                </Td>
                <Td>
                
                  {item.album.name}
    
                </Td>
              
                
                <Td>{item.artists}</Td>
                <Td>{item.album.release_date}</Td>
                <Td isNumeric>{item.popularity}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    );
  }
}
