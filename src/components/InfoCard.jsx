import React from 'react';

export default function InfoCard({
  icon,
  title,
  children,
  actionText = '',
  onAction,
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300 w-full sm:max-w-sm min-h-[100px] flex flex-col justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#26a17b] to-[#0d4e3a] text-white flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      {children && (
        <p className="text-sm text-gray-500 mt-4">
          {children}
        </p>
      )}

      {actionText && (
        <button
          onClick={onAction}
          className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
