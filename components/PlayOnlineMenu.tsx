import React, { useState, useEffect } from 'react';
import Button from './Button';
import { OnlineGameState } from '../types';

interface PlayOnlineMenuProps {
  onBack: () => void;
  playerId: string;
  onStartGame: (roomId: string) => void;
}

const generateRoomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const PlayOnlineMenu: React.FC<PlayOnlineMenuProps> = ({ onBack, playerId, onStartGame }) => {
  const [view, setView] = useState<'menu' | 'create' | 'join'>('menu');
  const [roomId, setRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [error, setError] = useState('');
  const [targetScore, setTargetScore] = useState(50);
  const scoreOptions = [20, 50, 100, 150];

  useEffect(() => {
    if (view !== 'create' || !roomId) return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === `room_${roomId}` && event.newValue) {
        const roomData: OnlineGameState = JSON.parse(event.newValue);
        if (roomData.status === 'playing') {
          onStartGame(roomId);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [view, roomId, onStartGame]);


  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    const initialGameState: OnlineGameState = {
      players: {
        [playerId]: { name: 'Player 1', score: 0 }
      },
      playerOrder: [playerId],
      currentPlayerId: playerId,
      diceValue: 1,
      targetScore: targetScore,
      winnerId: null,
      status: 'waiting',
    };
    localStorage.setItem(`room_${newRoomId}`, JSON.stringify(initialGameState));
    setView('create');
  };

  const handleJoinRoom = () => {
    setError('');
    if (!joinRoomId) {
      setError('Please enter a room code.');
      return;
    }
    const roomKey = `room_${joinRoomId.toUpperCase()}`;
    const roomDataJSON = localStorage.getItem(roomKey);

    if (!roomDataJSON) {
      setError('Room not found. Please check the code and try again.');
      return;
    }

    const roomData: OnlineGameState = JSON.parse(roomDataJSON);

    if (roomData.players[playerId]) {
      // already in room, probably the creator, let's go to game
      onStartGame(joinRoomId.toUpperCase());
      return;
    }

    if (Object.keys(roomData.players).length >= 2) {
      setError('This room is already full.');
      return;
    }

    roomData.players[playerId] = { name: 'Player 2', score: 0 };
    roomData.playerOrder.push(playerId);
    roomData.status = 'playing';
    
    localStorage.setItem(roomKey, JSON.stringify(roomData));
    onStartGame(joinRoomId.toUpperCase());
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room code copied to clipboard!');
  }

  const ScoreButton: React.FC<{ onClick: () => void, isSelected: boolean, children: React.ReactNode }> = ({ onClick, isSelected, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-300 font-semibold ${isSelected ? 'bg-[#00f5d4] text-[#1a202c]' : 'bg-[#4a5568] hover:bg-[#718096]'}`}
    >
        {children}
    </button>
  );

  if (view === 'create') {
    return (
      <div className="bg-[#2d3748] p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center">
        <h2 className="text-3xl font-bold text-[#00f5d4] mb-4">Your Room</h2>
        <p className="text-gray-400 mb-6">Share this code with your friend:</p>
        <div className="bg-gray-900 w-full p-4 rounded-lg text-center mb-4 cursor-pointer" onClick={handleCopyToClipboard}>
          <p className="text-4xl font-bold tracking-widest">{roomId}</p>
        </div>
        <Button onClick={handleCopyToClipboard} variant='secondary' className="mb-6">Copy Code</Button>
        <p className="text-gray-300 mb-8 animate-pulse">Waiting for a player to join...</p>
        <Button onClick={() => setView('menu')} variant="secondary">Back to Menu</Button>
      </div>
    );
  }

  if (view === 'join') {
    return (
      <div className="bg-[#2d3748] p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center">
        <h2 className="text-3xl font-bold text-[#00f5d4] mb-6">Join Room</h2>
        <input
          type="text"
          placeholder="Enter Room Code"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value)}
          className="w-full bg-[#1a202c] text-white p-3 rounded-lg mb-4 text-center uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#00f5d4]"
        />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="w-full space-y-3">
          <Button onClick={handleJoinRoom} variant="primary">Join Game</Button>
          <Button onClick={() => setView('menu')} variant="secondary">Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2d3748] p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center">
      <h2 className="text-3xl font-bold text-[#00f5d4] mb-8">Play Online</h2>
      <div className="w-full mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-3 text-center">Points to Win</h3>
         <div className="flex space-x-3">
          {scoreOptions.map(s => (
            <ScoreButton key={s} isSelected={targetScore === s} onClick={() => setTargetScore(s)}>{s}</ScoreButton>
          ))}
        </div>
      </div>
      <div className="w-full space-y-4">
        <Button onClick={handleCreateRoom} variant="primary">Create Room</Button>
        <Button onClick={() => setView('join')}>Join Room</Button>
        <Button onClick={onBack} variant="secondary">Back to Menu</Button>
      </div>
    </div>
  );
};

export default PlayOnlineMenu;