import React from 'react';
// import { Button } from '@/components/ui/button';



export default function InfoCard({
  icon,
  title,
  children,
  actionText = 'Learn More',
  onAction,
}) {
  return (
    <div className="flex items-start space-x-4 px-2 py-6 bg-white rounded-3xl shadow">
      <div className="text-indigo-500">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-gray-600">{children}</p>
        {onAction && (
          <div className="mt-4">
            <button onClick={onAction}>{actionText}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// Usage example
// 
// import InfoCard from './InfoCard';
// import { ShieldAlertIcon } from 'lucide-react';
//
// <InfoCard
//   icon={<ShieldAlertIcon size={24} />}
//   title="2FA Not Enabled"
//   actionText="Setup 2FA Now"
//   onAction={() => console.log('Redirect to 2FA setup')}
// >
//   Enabling two-factor authentication is a great way to secure your account.
// </InfoCard>
