import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

export default function InfoCard({
  icon,
  title,
  children,
  actionText = '',
  onAction,
  copyToClipboard
}) {
  return (
    <div className="bg-white p-6 overflow-x-auto rounded-2xl shadow-sm hover:shadow-md transition duration-300 w-full sm:max-w-sm min-h-[150px] flex flex-col justify-between">
     
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#26a17b] to-[#0d4e3a] text-white flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      {children && (
        <p className="text-sm truncate text-gray-500 mt-4">
          {children}
        </p>
      )}

      {actionText && (
        <div className=' relative flex items-center justify-between'>
          <button
          onClick={onAction}
          className=" truncate text-xm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          {actionText}
        </button>

        <button
              className="text-[#40B869] absolute -top-20 right-0 cursor-pointer hover:text-[#48c674]"
              onClick={copyToClipboard}
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
        </div>
      )}
    </div>
  );
}
// <InfoCard
//   icon={<ShieldAlertIcon size={24} />}
//   title="2FA Not Enabled"
//   actionText="Setup 2FA Now"
//   onAction={() => console.log('Redirect to 2FA setup')}
// >
//   Enabling two-factor authentication is a great way to secure your account.
// </InfoCard>
