import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import Game from "../components/Game";
import Rules from "../components/Rules";

const Index = () => {
  return (
    <Box maxWidth="400px" mx="auto" p={4}>
      <Heading as="h1" size="xl" textAlign="center" mb={8}>
        Liar's Dice
      </Heading>
      <Game />
      <Rules />
    </Box>
  );
};

export default Index;
