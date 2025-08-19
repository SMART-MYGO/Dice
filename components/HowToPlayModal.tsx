
import React from 'react';
import Button from './Button';

interface HowToPlayModalProps {
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[#2d3748] p-8 rounded-2xl shadow-2xl w-full max-w-md m-4 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-[#00f5d4] mb-6">How to Play</h2>
        <ul className="text-gray-300 space-y-3 list-disc list-inside text-left w-full mb-8">
          <li>The game can be played against the computer or another player on the same device.</li>
          <li>Select the score you need to reach to win (e.g., 20, 50, 100).</li>
          <li>On your turn, click the 'Roll Dice' button.</li>
          <li>The number you roll is added to your total score.</li>
          <li>Players take turns rolling the dice.</li>
          <li>The first player to reach or exceed the winning score wins the game!</li>
        </ul>
        <div className="w-full max-w-xs">
          <Button onClick={onClose} variant="primary">Got It!</Button>
        </div>
      </div>
    </div>
  );
};

export default HowToPlayModal;
