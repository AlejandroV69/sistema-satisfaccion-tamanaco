import React from 'react';

const Card = ({ children, title, icon, className = '', headerAction }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      {(title || icon) && (
        <div className="px-6 py-4 border-bottom border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <span className="text-accent">{icon}</span>}
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
