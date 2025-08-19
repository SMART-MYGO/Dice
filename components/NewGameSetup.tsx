
import React, { useState } from 'react';
import { GameMode } from '../types';
import Button from './Button';

interface NewGameSetupProps {
  onStartGame: (mode: GameMode, score: number) => void;
  onBack: () => void;
}

const OptionButton: React.FC<{ onClick: () => void, isSelected: boolean, children: React.ReactNode }> = ({ onClick, isSelected, children }) => (
  <button 
    onClick={onClick}
    className={`w-full text-left py-3 px-4 rounded-lg transition-all duration-300 flex items-center ${isSelected ? 'bg-[#00f5d4] text-[#1a202c]' : 'bg-[#4a5568] hover:bg-[#718096]'}`}
  >
    <span className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'border-[#1a202c] bg-[#1a202c]' : 'border-gray-400'} mr-3`}></span>
    {children}
  </button>
);

const ScoreButton: React.FC<{ onClick: () => void, isSelected: boolean, children: React.ReactNode }> = ({ onClick, isSelected, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-300 font-semibold ${isSelected ? 'bg-[#00f5d4] text-[#1a202c]' : 'bg-[#4a5568] hover:bg-[#718096]'}`}
    >
        {children}
    </button>
);

const NewGameSetup: React.FC<NewGameSetupProps> = ({ onStartGame, onBack }) => {
  const [mode, setMode] = useState<GameMode>(GameMode.VsComputer);
  const [score, setScore] = useState<number>(50);
  const scoreOptions = [20, 50, 100, 150];

  const handleStart = () => {
    onStartGame(mode, score);
  };

  return (
    <div className="bg-[#2d3748] p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col">
      <h2 className="text-3xl font-bold text-[#00f5d4] mb-8 text-center">New Game</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Game Mode</h3>
        <div className="space-y-3">
          <OptionButton isSelected={mode === GameMode.VsComputer} onClick={() => setMode(GameMode.VsComputer)}>Play vs Computer</OptionButton>
          <OptionButton isSelected={mode === GameMode.VsPlayerLocal} onClick={() => setMode(GameMode.VsPlayerLocal)}>Play vs Player (Local)</OptionButton>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-3">Points to Win</h3>
        <div className="flex space-x-3">
          {scoreOptions.map(s => (
            <ScoreButton key={s} isSelected={score === s} onClick={() => setScore(s)}>{s}</ScoreButton>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={handleStart} variant="primary">Start Game</Button>
        <Button onClick={onBack} variant="secondary">Back to Menu</Button>
      </div>
    </div>
  );
};

export default NewGameSetup;
