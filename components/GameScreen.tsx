import React, { useState, useEffect, useCallback } from 'react';
import { GameMode, Player, OnlineGameState } from '../types';
import Dice from './Dice';
import Button from './Button';

interface GameScreenProps {
  gameMode: GameMode;
  targetScore: number;
  onExit: () => void;
  playerId?: string;
  roomId?: string | null;
}

const PlayerCard: React.FC<{ name: string; score: number; isActive: boolean }> = ({ name, score, isActive }) => (
  <div className={`flex flex-col items-center p-4 rounded-lg w-32 md:w-40 transition-all duration-300 ${isActive ? 'bg-[#00f5d4] text-gray-900 shadow-lg scale-105' : 'bg-gray-700'}`}>
    <span className="text-sm font-semibold">{name}</span>
    <span className="text-3xl font-bold mt-1">{score}</span>
  </div>
);

const GameScreen: React.FC<GameScreenProps> = ({ gameMode, targetScore, onExit, playerId, roomId }) => {
  // Local game state
  const [localScores, setLocalScores] = useState({ [Player.Player1]: 0, [Player.Player2]: 0, [Player.Computer]: 0 });
  const [localCurrentPlayer, setLocalCurrentPlayer] = useState<Player>(Player.Player1);
  const [localDiceValue, setLocalDiceValue] = useState<number>(1);
  const [localWinner, setLocalWinner] = useState<Player | null>(null);
  
  // Shared state
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [turnMessage, setTurnMessage] = useState<string>("Player 1's turn.");

  // Online game state
  const [onlineState, setOnlineState] = useState<OnlineGameState | null>(null);

  const isOnline = gameMode === GameMode.VsPlayerOnline && roomId && playerId;
  const player2Name = gameMode === GameMode.VsComputer ? Player.Computer : Player.Player2;
  const isMyTurnOnline = isOnline && onlineState?.currentPlayerId === playerId;

  const updateOnlineState = (newState: OnlineGameState) => {
    setOnlineState(newState);
    if (newState.winnerId) {
      const winnerName = newState.players[newState.winnerId].name;
      setTurnMessage(`${winnerName} wins!`);
    } else {
      const currentPlayerName = newState.players[newState.currentPlayerId].name;
      setTurnMessage(`${currentPlayerName}'s turn.`);
    }
  };
  
  useEffect(() => {
    if (isOnline) {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === `room_${roomId}` && event.newValue) {
          const roomData: OnlineGameState = JSON.parse(event.newValue);
          updateOnlineState(roomData);
        }
      };
      
      const initialData = localStorage.getItem(`room_${roomId}`);
      if (initialData) {
        updateOnlineState(JSON.parse(initialData));
      }

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [isOnline, roomId]);


  const handleRoll = () => {
    if (isRolling || (isOnline && !isMyTurnOnline) || (!isOnline && localWinner)) return;

    setIsRolling(true);
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        const randomValue = Math.floor(Math.random() * 6) + 1;
        if(isOnline) {
            setOnlineState(prev => prev ? {...prev, diceValue: randomValue} : null);
        } else {
            setLocalDiceValue(randomValue);
        }
        rollCount++;
        
        if (rollCount > 10) {
            clearInterval(rollInterval);
            const finalValue = Math.floor(Math.random() * 6) + 1;
            
            if (isOnline && onlineState) {
                const roomDataKey = `room_${roomId}`;
                const currentRoomDataJSON = localStorage.getItem(roomDataKey);
                if (!currentRoomDataJSON) return;

                const currentRoomData: OnlineGameState = JSON.parse(currentRoomDataJSON);
                
                const currentScore = currentRoomData.players[onlineState.currentPlayerId].score;
                const newScore = currentScore + finalValue;

                const nextPlayerIndex = (currentRoomData.playerOrder.indexOf(onlineState.currentPlayerId) + 1) % 2;
                const nextPlayerId = currentRoomData.playerOrder[nextPlayerIndex];

                const newState: OnlineGameState = {
                    ...currentRoomData,
                    diceValue: finalValue,
                    players: {
                        ...currentRoomData.players,
                        [onlineState.currentPlayerId]: {
                            ...currentRoomData.players[onlineState.currentPlayerId],
                            score: newScore,
                        }
                    },
                    currentPlayerId: newScore >= currentRoomData.targetScore ? onlineState.currentPlayerId : nextPlayerId,
                    winnerId: newScore >= currentRoomData.targetScore ? onlineState.currentPlayerId : null,
                };
                if(newState.winnerId) newState.status = 'finished';

                localStorage.setItem(roomDataKey, JSON.stringify(newState));
                updateOnlineState(newState);
            } else {
                setLocalDiceValue(finalValue);
                setLocalScores(prev => {
                    const newScore = prev[localCurrentPlayer] + finalValue;
                    if (newScore >= targetScore) {
                        setLocalWinner(localCurrentPlayer);
                        setTurnMessage(`${localCurrentPlayer} wins!`);
                    } else {
                        const nextPlayer = localCurrentPlayer === Player.Player1 ? player2Name : Player.Player1;
                        setLocalCurrentPlayer(nextPlayer);
                        setTurnMessage(`${nextPlayer}'s turn.`);
                    }
                    return { ...prev, [localCurrentPlayer]: newScore };
                });
            }
            setIsRolling(false);
        }
    }, 100);
  };
  
  useEffect(() => {
    if (gameMode === GameMode.VsComputer && localCurrentPlayer === Player.Computer && !localWinner && !isRolling) {
      const computerTurnTimeout = setTimeout(() => {
        handleRoll();
      }, 1500);
      return () => clearTimeout(computerTurnTimeout);
    }
  }, [localCurrentPlayer, localWinner, isRolling, gameMode, handleRoll]);


  const resetGame = () => {
    if (isOnline) {
      const roomDataKey = `room_${roomId}`;
      const roomJSON = localStorage.getItem(roomDataKey);
      if(!roomJSON) return;
      const roomData: OnlineGameState = JSON.parse(roomJSON);
      
      const resetPlayers = roomData.playerOrder.reduce((acc, pId) => {
        acc[pId] = {...roomData.players[pId], score: 0};
        return acc;
      }, {} as OnlineGameState['players']);
      
      const newState: OnlineGameState = {
        ...roomData,
        players: resetPlayers,
        currentPlayerId: roomData.playerOrder[0],
        winnerId: null,
        status: 'playing',
        diceValue: 1,
      };
      localStorage.setItem(roomDataKey, JSON.stringify(newState));
      updateOnlineState(newState);
    } else {
      setLocalScores({ [Player.Player1]: 0, [Player.Player2]: 0, [Player.Computer]: 0 });
      setLocalCurrentPlayer(Player.Player1);
      setLocalDiceValue(1);
      setLocalWinner(null);
      setTurnMessage("Player 1's turn.");
    }
  };

  if(isOnline && !onlineState) {
    return <div className="text-center">Loading online game...</div>;
  }

  const p1 = isOnline ? onlineState!.players[onlineState!.playerOrder[0]] : { name: 'Player 1', score: localScores[Player.Player1] };
  const p2 = isOnline ? onlineState!.players[onlineState!.playerOrder[1]] : { name: player2Name, score: localScores[player2Name] };
  const activePlayerName = isOnline ? onlineState!.players[onlineState!.currentPlayerId].name : localCurrentPlayer;
  const winner = isOnline ? onlineState?.winnerId : localWinner;
  const diceValue = isOnline ? onlineState!.diceValue : localDiceValue;

  return (
    <div className="bg-[#2d3748] p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col items-center">
      <div className="flex items-center justify-around w-full mb-6">
        <PlayerCard name={p1.name} score={p1.score} isActive={activePlayerName === p1.name} />
        <span className="text-xl font-bold text-gray-400">VS</span>
        <PlayerCard name={p2.name} score={p2.score} isActive={activePlayerName === p2.name} />
      </div>

      <p className="text-gray-300 h-6 mb-6">{turnMessage}</p>

      <div className="my-6">
        <Dice value={diceValue} isRolling={isRolling} />
      </div>

      {winner ? (
        <div className="w-full flex flex-col space-y-3">
           <Button onClick={resetGame} variant="primary" disabled={isOnline && onlineState?.players[playerId!]?.name !== 'Player 1'}>
            {isOnline && onlineState?.players[playerId!]?.name !== 'Player 1' ? 'Waiting for host...' : 'Play Again'}
           </Button>
           <Button onClick={onExit} variant="secondary">Exit to Menu</Button>
        </div>
      ) : (
         <div className="w-full flex flex-col space-y-3">
          <Button onClick={handleRoll} variant="primary" disabled={isRolling || (gameMode === GameMode.VsComputer && localCurrentPlayer === Player.Computer) || (isOnline && !isMyTurnOnline)}>
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </Button>
          <Button onClick={onExit} variant="secondary">Exit to Menu</Button>
        </div>
      )}
    </div>
  );
};

export default GameScreen;