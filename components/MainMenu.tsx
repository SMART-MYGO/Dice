
import React from 'react';
import Button from './Button';

interface MainMenuProps {
  onNewGame: () => void;
  onInviteFriend: () => void;
  onHowToPlay: () => void;
}

const MenuIcon: React.FC = () => (
  <div className="w-24 h-24 bg-slate-100 rounded-2xl shadow-lg p-4 grid grid-cols-3 grid-rows-3 gap-1 place-items-center mb-6">
    <span className="w-4 h-4 bg-gray-800 rounded-full col-start-1 row-start-1"></span>
    <span className="w-4 h-4 bg-gray-800 rounded-full col-start-3 row-start-1"></span>
    <span className="w-4 h-4 bg-gray-800 rounded-full col-start-2 row-start-2"></span>
    <span className="w-4 h-4 bg-gray-800 rounded-full col-start-1 row-start-3"></span>
    <span className="w-4 h-4 bg-gray-800 rounded-full col-start-3 row-start-3"></span>
  </div>
);

const MainMenu: React.FC<MainMenuProps> = ({ onNewGame, onInviteFriend, onHowToPlay }) => {
  return (
    <div className="bg-[#2d3748] p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center">
      <MenuIcon />
      <h1 className="text-4xl font-bold text-[#00f5d4] mb-2">Dice Cube Arena</h1>
      <p className="text-gray-400 mb-8">The ultimate test of luck and strategy.</p>
      
      <div className="w-full space-y-4">
        <Button onClick={onNewGame} variant="primary">
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Game
          </span>
        </Button>
        <Button onClick={onInviteFriend}>
           <span className="flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
               <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
             </svg>
             Invite Friend
           </span>
        </Button>
        <Button onClick={onHowToPlay}>
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            How to Play
          </span>
        </Button>
      </div>
      <p className="text-gray-500 mt-8 text-xs">A simple dice game built with React & Tailwind CSS.</p>
    </div>
  );
};

export default MainMenu;
