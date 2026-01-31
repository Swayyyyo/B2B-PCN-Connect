
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  elevation?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  title?: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  elevation = 'md', 
  className = '',
  title,
  subtitle
}) => {
  const shadows = {
    none: 'border border-slate-200',
    sm: 'shadow-sm border border-slate-200',
    md: 'shadow-md border border-slate-100',
    lg: 'shadow-xl border border-slate-50',
    xl: 'shadow-2xl border border-slate-50',
  };

  return (
    <div className={`bg-white rounded-xl overflow-hidden ${shadows[elevation]} ${className}`}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
