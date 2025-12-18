import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import UserManagement from './UserManagement';
import JobManagement from './JobManagement';
import CandidateReview from './CandidateReview';
import { getDashboardStats } from '../utils/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');


  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'jobs', label: 'Job Posting', icon: Briefcase },
    { id: 'candidates', label: 'Candidate Review', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your platform and users</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="inline h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pt-6">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'jobs' && <JobManagement />}
        {activeTab === 'candidates' && <CandidateReview />}
      </div>
    </div>
  );
}