import React, { useState } from "react";
import { Box, Button, Text, VStack, HStack, Select, useToast } from "@chakra-ui/react";
import { FaDice } from "react-icons/fa";

const Game = () => {
  const [playerDice, setPlayerDice] = useState([]);
  const [computerDice, setComputerDice] = useState([]);
  const [playerBid, setPlayerBid] = useState({ quantity: 1, value: 1 });
  const [computerBid, setComputerBid] = useState({ quantity: 1, value: 1 });
  const [currentPlayer, setCurrentPlayer] = useState("Player");
  const [gameStatus, setGameStatus] = useState("Player's turn to bid");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const endGame = (winner) => {
    setGameOver(true);
    setWinner(winner);
  };
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
    const { quantity, value } = playerBid;

    if (quantity <= computerBid.quantity && value <= computerBid.value) {
      toast({
        title: "Invalid Bid",
        description: "Bid must be higher than previous bid",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setComputerBid({ quantity, value });
    setCurrentPlayer("Computer");
    setGameStatus("Computer is bidding...");

    setTimeout(() => {
      const newQuantity = Math.floor(Math.random() * 5) + 1;
      const newValue = Math.floor(Math.random() * 6) + 1;
      setPlayerBid({ quantity: newQuantity, value: newValue });
      setCurrentPlayer("Player");
      setGameStatus("Player's turn to bid");
    }, 1500);
  };

  const handleBluffCall = () => {
    const totalDice = [...playerDice, ...computerDice];
    const { quantity, value } = computerBid;
    const count = totalDice.filter((dice) => dice === value).length;

    if (count >= quantity) {
      setWinner("Computer");
    } else {
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
    setComputerBid({ quantity: 1, value: 1 });
    setCurrentPlayer("Player");
    setGameStatus("Player's turn to bid");
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
    <Box maxWidth="400px" mx="auto" p={4}>
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
          <Box bg={currentPlayer === "Player" ? "green.500" : "gray.500"} p={4} borderRadius="md" mb={4}>
            <Text fontSize="xl" fontWeight="bold" color="white">
              {currentPlayer}'s turn
            </Text>
          </Box>
          {!gameOver && (
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Previous Bid: {computerBid.quantity} x {computerBid.value}
            </Text>
          )}
          {!gameOver && currentPlayer === "Player" && computerBid.quantity > 1 && (
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
              <Button colorScheme="green" size="lg" onClick={handleBid} mb={4}>
                Place Bid
              </Button>
              <Button colorScheme="red" size="lg" onClick={handleBluffCall}>
                Call Bluff
              </Button>
            </>
          )}
          {gameOver && (
            <>
              <Text fontSize="2xl" fontWeight="bold" mb={4} color={winner === "Player" ? "green.500" : "red.500"}>
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
  );
};

export default Game;
