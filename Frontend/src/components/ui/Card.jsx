import React from 'react';

const Card = ({ children, title, icon: Icon, className = '', headerAction }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      {(title || Icon) && (
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && <span className="text-accent flex items-center justify-center"><Icon size={20} /></span>}
            {title && <h3 className="text-lg font-serif text-slate-900 m-0">{title}</h3>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;

