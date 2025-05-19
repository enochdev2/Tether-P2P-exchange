import React from 'react'
import InfoCard from '../../components/InfoCard'
import { Link } from 'react-router-dom'
import { SettingsIcon } from 'lucide-react'

const SystemAlert = () => {
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Registration List */}
          <InfoCard
            icon={<SettingsIcon size={24} />}
            title="Account Setting"
            // actionText=""
            onAction={() => console.log("Navigate to security questions")}
          ></InfoCard>

          {/* System Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">System Alerts</h2>
            <ul className="mt-4">
              <li className="py-2">No recent issues</li>
            </ul>
            <Link to="/admin/alerts" className="text-blue-600 hover:underline">
              Manage Alerts
            </Link>
          </div>
        </div>
  )
}

export default SystemAlert