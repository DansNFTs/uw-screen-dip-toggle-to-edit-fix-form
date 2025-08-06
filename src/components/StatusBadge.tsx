import React from 'react';

interface StatusBadgeProps {
  status: 'passed' | 'failed' | 'pending';
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'passed':
        return 'bg-[rgba(231,249,223,1)]';
      case 'failed':
        return 'bg-red-100';
      case 'pending':
        return 'bg-yellow-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getIconStyles = () => {
    switch (status) {
      case 'passed':
        return 'bg-[rgba(98,217,42,1)]';
      case 'failed':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`${getStatusStyles()} flex items-center gap-2 justify-center p-1`}>
      <div className="text-black text-sm font-medium">{label}</div>
      <div className={`${getIconStyles()} flex min-h-4 flex-col items-center justify-center w-4 h-4 pl-1 pr-[3px] rounded-[50px]`}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/977c705c687843d897208bcf3a90db3a/08b631ac9c9a09dc34757b6ac0cfd70729637829?placeholderIfAbsent=true"
          className="aspect-[1.5] object-contain w-[9px]"
          alt="Status icon"
        />
      </div>
    </div>
  );
};
