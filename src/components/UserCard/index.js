import { Box, Text } from "@chakra-ui/layout";
import React from "react";

export default function UserCard({ name, age }) {
  return (
    <Box
      p="1rem"
      shadow="md"
      borderRadius="md"
      w={{ base: "100%", md: "50%", lg: "23%" }}
      mb="1.5rem"
    >
      <Text fontWeight="bold" fontSize="xl">
        {name}
      </Text>
      <Text fontSize="sm">{`Idade: ${age} anos`}</Text>
    </Box>
  );
}
