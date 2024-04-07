import React, { useState } from "react";
import { Box, Button, Text, VStack, HStack, Select, useToast } from "@chakra-ui/react";
import { FaDice } from "react-icons/fa";

const Game = () => {
  const [playerDice, setPlayerDice] = useState([]);
  const [computerDice, setComputerDice] = useState([]);
  const [playerBid, setPlayerBid] = useState({ quantity: 1, value: 1 });
  const [allBids, setAllBids] = useState([]);
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

    const lastBid = allBids[allBids.length - 1] || { quantity: 0, value: 0 };
    if (quantity <= lastBid.quantity && value <= lastBid.value) {
      toast({
        title: "Invalid Bid",
        description: "Bid must be higher than previous bid",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    setAllBids([...allBids, { player: "Player", ...playerBid }]);
    setPlayerBid({ quantity: 1, value: 1 });
    setCurrentPlayer("Computer");
    setGameStatus("Computer is bidding...");

    setTimeout(() => {
      const newQuantity = Math.floor(Math.random() * 5) + 1;
      const newValue = Math.floor(Math.random() * 6) + 1;
      const computerBid = { player: "Computer", quantity: newQuantity, value: newValue };
      setAllBids((prevBids) => [...prevBids, { player: "Player", ...playerBid }, computerBid]);
      setCurrentPlayer("Player");
      setGameStatus("Player's turn to bid");
    }, 1500);
  };

  const handleBluffCall = () => {
    if (allBids.length === 0) {
      toast({
        title: "No Bids Placed",
        description: "Cannot call bluff before any bids are placed",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const totalDice = [...playerDice, ...computerDice];
    const lastBid = allBids[allBids.length - 1];
    const { quantity, value } = lastBid;
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
    setAllBids([]);
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
          {gameOver && allBids.length > 0 && (
            <Text fontSize="xl" fontWeight="bold">
              Computer's Last Bid: {allBids[allBids.length - 1].quantity} x {allBids[allBids.length - 1].value}
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
          {!gameOver && allBids.length > 0 && (
            <Box mb={4}>
              <Text fontSize="xl" fontWeight="bold" mb={2}>
                Bid History:
              </Text>
              {allBids.map((bid, index) => (
                <Text key={index} fontSize="lg">
                  {bid.player}: {bid.quantity} x {bid.value}
                </Text>
              ))}
            </Box>
          )}
          {!gameOver && currentPlayer === "Player" && (
            <Button colorScheme="red" size="lg" onClick={handleBluffCall}>
              Call Bluff
            </Button>
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
