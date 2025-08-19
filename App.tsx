import React, { useState } from 'react';
import { Screen, GameMode } from './types';
import MainMenu from './components/MainMenu';
import NewGameSetup from './components/NewGameSetup';
import GameScreen from './components/GameScreen';
import HowToPlayModal from './components/HowToPlayModal';
import PlayOnlineMenu from './components/PlayOnlineMenu';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.MainMenu);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.VsComputer);
  const [targetScore, setTargetScore] = useState<number>(50);
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [playerId] = useState(() => `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleNewGame = (mode: GameMode, score: number) => {
    setGameMode(mode);
    setTargetScore(score);
    setRoomId(null);
    setScreen(Screen.Game);
  };
  
  const handleStartOnlineGame = (newRoomId: string) => {
    const roomData = JSON.parse(localStorage.getItem(`room_${newRoomId}`) || '{}');
    setGameMode(GameMode.VsPlayerOnline);
    setRoomId(newRoomId);
    setTargetScore(roomData.targetScore || 50);
    setScreen(Screen.Game);
  };

  const handleExitGame = () => {
    setRoomId(null);
    setScreen(Screen.MainMenu);
  };


  const renderScreen = () => {
    switch (screen) {
      case Screen.NewGame:
        return <NewGameSetup onStartGame={handleNewGame} onBack={() => setScreen(Screen.MainMenu)} />;
      case Screen.Game:
        return <GameScreen 
          gameMode={gameMode} 
          targetScore={targetScore} 
          onExit={handleExitGame}
          playerId={playerId}
          roomId={roomId}
        />;
      case Screen.OnlineMenu:
        return <PlayOnlineMenu 
          playerId={playerId}
          onStartGame={handleStartOnlineGame}
          onBack={() => setScreen(Screen.MainMenu)} 
        />;
      case Screen.MainMenu:
      default:
        return <MainMenu 
          onNewGame={() => setScreen(Screen.NewGame)} 
          onInviteFriend={() => setScreen(Screen.OnlineMenu)} 
          onHowToPlay={() => setShowHowToPlay(true)} 
        />;
    }
  };

  return (
    <div className="bg-[#1a202c] min-h-screen text-white flex flex-col items-center justify-center p-4 font-sans relative">
      <div className="absolute top-4 left-4 text-gray-400 text-sm">Dice Cube Arena</div>
      {renderScreen()}
      {showHowToPlay && <HowToPlayModal onClose={() => setShowHowToPlay(false)} />}
    </div>
  );
};

export default App;