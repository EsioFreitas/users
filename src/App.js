import { Button } from "@chakra-ui/button";
import { SearchIcon } from "@chakra-ui/icons";
import { Input } from "@chakra-ui/input";
import { Box, Heading, HStack } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { useEffect, useState } from "react";
import UserCard from "./components/UserCard";
import api from "./services/api";
import ReactPaginate from "react-paginate";
import "./paginate.css";

const statusEnum = {
  success: 1,
  void: 2,
  loading: 3,
};

const itemsPerPage = 100;

function App() {
  const [status, setStatus] = useState(statusEnum.void);
  const [dataUsers, setDataUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [searchByName, setSearchByName] = useState("");
  const [searchByAge, setSearchByAge] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setUsers(dataUsers.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(dataUsers.length / itemsPerPage));
  }, [itemOffset, itemsPerPage]);

  const getUsers = async () => {
    setStatus(statusEnum.loading);
    const { data, status } = await api.get("users");

    if (status === 200) {
      setStatus(statusEnum.success);
      setUsers(data.data.slice(0, itemsPerPage));
      setDataUsers(data.data);
      setPageCount(Math.ceil(data.data.length / itemsPerPage));
    } else {
      setStatus(statusEnum.void);
      setUsers([]);
      setDataUsers([]);
    }
  };

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % dataUsers.length;
    setItemOffset(newOffset);
  };

  const handleSearchClick = () => {
    let searchUsers = [];

    if (searchByAge.length && searchByName.length) {
      searchUsers = dataUsers
        .filter((user) => user.name.includes(searchByName))
        .filter((user) => user.age == searchByAge);
    } else if (searchByName.length) {
      searchUsers = dataUsers.filter((user) =>
        user.name.includes(searchByName)
      );
    } else if (searchByAge.length) {
      searchUsers = dataUsers.filter((user) => user.age == searchByAge);
    } else if (!searchByAge.length && !searchByName.length) {
      searchUsers = dataUsers.slice(0, itemsPerPage);
    }

    setUsers(searchUsers);
  };

  const renderCardContainer = () => {
    switch (status) {
      case statusEnum.loading:
        return <Spinner size="lg" />;
      case statusEnum.success:
        return (
          <Box display="flex" flexWrap="wrap" justifyContent="space-between">
            {users.map((user, index) => (
              <UserCard
                name={user.name}
                age={user.age}
                key={`user-card-${index}`}
              />
            ))}
          </Box>
        );
      case statusEnum.loading:
      default:
        return <Heading my="2rem">Usuário(s) não encontrado(s)</Heading>;
    }
  };

  return (
    <Box p="1rem">
      <HStack>
        <Input
          type="tel"
          placeholder="Buscar usuários"
          value={searchByName}
          onChange={(e) => setSearchByName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Idade"
          w="10rem"
          value={searchByAge}
          onChange={(e) => setSearchByAge(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleSearchClick}>
          <SearchIcon color="gray.300" />
        </Button>
      </HStack>
      <HStack justifyContent="space-between" flexWrap="wrap" my="2rem">
        <Heading>Usuários</Heading>
        {status === statusEnum.success && (
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
          />
        )}
      </HStack>
      {renderCardContainer()}
    </Box>
  );
}

export default App;
