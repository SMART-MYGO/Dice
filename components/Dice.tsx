
import React from 'react';

interface DiceProps {
  value: number;
  isRolling?: boolean;
}

const Dot: React.FC = () => <span className="w-4 h-4 md:w-6 md:h-6 bg-gray-800 rounded-full"></span>;

const Dice: React.FC<DiceProps> = ({ value, isRolling }) => {
  const baseClasses = "w-28 h-28 md:w-40 md:h-40 bg-slate-100 rounded-2xl shadow-lg p-4 grid grid-cols-3 grid-rows-3 gap-1 place-items-center transition-transform duration-300";
  const rollingClasses = "animate-spin";

  const patterns: { [key: number]: React.ReactNode[] } = {
    1: [<Dot key="1-1" />],
    2: [<Dot key="2-1" />, <Dot key="2-2" />],
    3: [<Dot key="3-1" />, <Dot key="3-2" />, <Dot key="3-3" />],
    4: [<Dot key="4-1" />, <Dot key="4-2" />, <Dot key="4-3" />, <Dot key="4-4" />],
    5: [<Dot key="5-1" />, <Dot key="5-2" />, <Dot key="5-3" />, <Dot key="5-4" />, <Dot key="5-5" />],
    6: [<Dot key="6-1" />, <Dot key="6-2" />, <Dot key="6-3" />, <Dot key="6-4" />, <Dot key="6-5" />, <Dot key="6-6" />],
  };

  const getGridClass = (val: number) => {
    switch (val) {
      case 1: return "col-start-2 row-start-2";
      case 2: return "grid-cols-2 grid-rows-1 justify-items-center items-center gap-12";
      case 3: return "[&>*:nth-child(1)]:col-start-1 [&>*:nth-child(1)]:row-start-3 [&>*:nth-child(2)]:col-start-2 [&>*:nth-child(2)]:row-start-2 [&>*:nth-child(3)]:col-start-3 [&>*:nth-child(3)]:row-start-1";
      case 4: return "grid-cols-2 grid-rows-2 gap-y-8";
      case 5: return "[&>*:nth-child(1)]:col-start-1 [&>*:nth-child(1)]:row-start-1 [&>*:nth-child(2)]:col-start-3 [&>*:nth-child(2)]:row-start-1 [&>*:nth-child(3)]:col-start-2 [&>*:nth-child(3)]:row-start-2 [&>*:nth-child(4)]:col-start-1 [&>*:nth-child(4)]:row-start-3 [&>*:nth-child(5)]:col-start-3 [&>*:nth-child(5)]:row-start-3";
      case 6: return "grid-cols-2 grid-rows-3 gap-y-2";
      default: return "";
    }
  };

  return (
    <div className={`${baseClasses} ${getGridClass(value)} ${isRolling ? rollingClasses : ''}`}>
      {patterns[value]}
    </div>
  );
};

export default Dice;
