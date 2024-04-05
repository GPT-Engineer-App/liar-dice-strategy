import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

const Rules = () => {
  return (
    <Box mt={8} p={4} bg="gray.100" borderRadius="md">
      <Heading as="h2" size="lg" mb={4}>
        Rules
      </Heading>
      <Text mb={2}>1. Each player starts with five dice.</Text>
      <Text mb={2}>2. Players take turns bidding on the total number of a specific face value that are showing among all the dice on the table.</Text>
      <Text mb={2}>3. Each bid must be higher than the previous bid, either in quantity or face value.</Text>
      <Text mb={2}>4. If a player believes the previous bid was too high, they can challenge by saying "Liar!"</Text>
      <Text mb={2}>5. All dice are then revealed. If the bid was too high, the bidder loses. If not, the challenger loses.</Text>
      <Text>6. The game continues until only one player has dice remaining.</Text>
    </Box>
  );
};

export default Rules;
