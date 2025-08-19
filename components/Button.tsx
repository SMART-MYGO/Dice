
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'secondary', className = '', disabled = false }) => {
  const baseClasses = 'w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2d3748]';
  
  const variantClasses = {
    primary: 'bg-[#00f5d4] text-[#1a202c] hover:bg-[#00d8b9] focus:ring-[#00f5d4]',
    secondary: 'bg-[#4a5568] text-white hover:bg-[#718096] focus:ring-[#718096]'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
