import React, { useState } from "react";
import { Box, Heading, Button, Text, VStack, HStack, Select, useToast } from "@chakra-ui/react";
import { FaDice } from "react-icons/fa";
import Rules from "../components/Rules";

const Index = () => {
  const [playerDice, setPlayerDice] = useState([]);
  const [computerDice, setComputerDice] = useState([]);
  const [playerBid, setPlayerBid] = useState({ quantity: 1, value: 1 });
  const [computerBid, setComputerBid] = useState({ quantity: 1, value: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const toast = useToast();

  const rollDice = () => {
    const newPlayerDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    const newComputerDice = Array.from({ length: 5 }, () => Math.floor(Math.random() * 6) + 1);
    setPlayerDice(newPlayerDice);
    setComputerDice(newComputerDice);
    setGameOver(false);
    setWinner(null);
  };

  const handleBid = () => {
    const totalDice = [...playerDice, ...computerDice];
    const { quantity, value } = playerBid;
    const count = totalDice.filter((dice) => dice === value).length;

    if (count >= quantity) {
      setWinner("Computer");
    } else {
      const newQuantity = Math.floor(Math.random() * 5) + 1;
      const newValue = Math.floor(Math.random() * 6) + 1;
      setComputerBid({ quantity: newQuantity, value: newValue });
      setPlayerBid({ quantity: newQuantity, value: newValue });
      setWinner("Player");
    }
    setGameOver(true);
  };

  const handleQuantityChange = (e) => {
    setPlayerBid({ ...playerBid, quantity: parseInt(e.target.value) });
  };

  const handleValueChange = (e) => {
    setPlayerBid({ ...playerBid, value: parseInt(e.target.value) });
  };

  const handlePlayAgain = () => {
    setPlayerDice([]);
    setComputerDice([]);
    setPlayerBid({ quantity: 1, value: 1 });
    setGameOver(false);
    setWinner(null);
    toast({
      title: "New Game",
      description: "Starting a new game of Liar's Dice!",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <>
        <Box maxWidth="400px" mx="auto" p={4}>
          <Heading as="h1" size="xl" textAlign="center" mb={8}>
            Liar's Dice
          </Heading>
          {playerDice.length === 0 ? (
            <Button leftIcon={<FaDice />} colorScheme="blue" size="lg" onClick={rollDice}>
              Roll Dice
            </Button>
          ) : (
            <VStack spacing={8}>
              <Text fontSize="xl" fontWeight="bold">
                Your Dice: {playerDice.join(", ")}
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                Computer Dice: {gameOver ? computerDice.join(", ") : "Hidden"}
              </Text>
              {gameOver && (
                <Text fontSize="xl" fontWeight="bold">
                  Computer's Bid: {computerBid.quantity} x {computerBid.value}
                </Text>
              )}
              {!gameOver && (
                <>
                  <HStack>
                    <Select value={playerBid.quantity} onChange={handleQuantityChange}>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </Select>
                    <Select value={playerBid.value} onChange={handleValueChange}>
                      {[...Array(6)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </Select>
                  </HStack>
                  <Button colorScheme="green" size="lg" onClick={handleBid}>
                    Place Bid
                  </Button>
                </>
              )}
              {gameOver && (
                <>
                  <Text fontSize="2xl" fontWeight="bold">
                    {winner} wins!
                  </Text>
                  <Button colorScheme="blue" size="lg" onClick={handlePlayAgain}>
                    Play Again
                  </Button>
                </>
              )}
            </VStack>
          )}
        </Box>
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
      </>
      <Rules />
    </>
  );
};

export default Index;
