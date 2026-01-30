import { useState, useEffect } from 'react';
import { 
  Briefcase, Calendar, Clock, CheckCircle, XCircle, 
  AlertCircle, Clock4, Search, Filter, Download,
  ChevronRight, Building, MapPin, DollarSign, TrendingUp
} from 'lucide-react';
import { getApplicationStatus } from '../utils/api';
import toast from 'react-hot-toast';

// Status badges component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    applied: { 
      icon: Clock4, 
      color: 'bg-blue-100 text-blue-800',
      text: 'Pending'
    },
    under_review: { 
      icon: AlertCircle, 
      color: 'bg-yellow-100 text-yellow-800',
      text: 'Reviewed'
    },
    shortlisted: { 
      icon: CheckCircle, 
      color: 'bg-purple-100 text-purple-800',
      text: 'Shortlisted'
    },
    rejected: { 
      icon: XCircle, 
      color: 'bg-red-100 text-red-800',
      text: 'Rejected'
    },
    accepted: { 
      icon: CheckCircle, 
      color: 'bg-emerald-100 text-emerald-800',
      text: 'Accepted'
    }
  };

  const config = statusConfig[status] || statusConfig.applied;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="h-4 w-4 mr-1.5" />
      {config.text}
    </span>
  );
};

// Application card component
const ApplicationCard = ({ application }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 mt-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {application.job_title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="flex items-center text-sm text-gray-600">
                  <Building className="h-4 w-4 mr-1" />
                  {application.company || 'Company Name'}
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {application.location || 'Remote'}
                </span>
                {application.salary && (
                  <span className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {application.salary}
                  </span>
                )}
              </div>
            </div>
            <StatusBadge status={application.status} />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Application ID</p>
              <p className="text-sm font-medium text-gray-900">
                #{application.application_id.toString().slice(0, 8)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Applied Date</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(application.applied_at)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Status Updated</p>
              <p className="text-sm font-medium text-gray-900">
                {application.updated_at ? getDaysAgo(application.updated_at) : 'Recently'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Application Status Page
export default function ApplicationStatusPage() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterAndSortApplications();
  }, [applications, searchTerm, statusFilter, sortBy]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplicationStatus();
      setApplications(data);
      setFilteredApplications(data);
    } catch (error) {
      toast.error('Failed to load applications');
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortApplications = () => {
    let result = [...applications];

    // Search filter
    if (searchTerm) {
      result = result.filter(app =>
        app.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (app.company && app.company.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.applied_at) - new Date(a.applied_at);
        case 'oldest':
          return new Date(a.applied_at) - new Date(b.applied_at);
        case 'title':
          return a.job_title.localeCompare(b.job_title);
        default:
          return 0;
      }
    });

    setFilteredApplications(result);
  };

  const getStats = () => {
    const total = applications.length;
    const active = applications.filter(app => 
      !['rejected', 'withdrawn', 'accepted'].includes(app.status)
    ).length;
    const inProgress = applications.filter(app => 
      ['under_review', 'shortlisted', 'interview'].includes(app.status)
    ).length;
    const successRate = total > 0 
      ? Math.round((applications.filter(app => 
          ['offered', 'accepted'].includes(app.status)
        ).length / total) * 100)
      : 0;

    return { total, active, inProgress, successRate };
  };

  const stats = getStats();

  const exportToCSV = () => {
    const headers = ['Job Title', 'Company', 'Status', 'Applied Date', 'Application ID'];
    const csvData = applications.map(app => [
      app.job_title,
      app.company || '',
      app.status,
      new Date(app.applied_at).toLocaleDateString(),
      app.application_id
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Applications exported successfully');
  };

  return (
    <div className="space-y-7 mt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Application Status</h1>
          <p className="text-gray-600 mt-2">Track all your job applications in one place</p>
        </div>
        <button
          onClick={exportToCSV}
          className="mt-4 md:mt-0 btn btn-outline flex items-center"
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="inline h-4 w-4 mr-1" />
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="reviewed">Reviewed</option>
                <option value="rejected">Rejected</option>
                <option value="accepted">Accepted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline h-4 w-4 mr-1" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Job Title (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Applications ({filteredApplications.length})
          </h2>
          <button
            onClick={fetchApplications}
            className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
          >
            Refresh
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="card text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {applications.length === 0 ? 'No applications yet' : 'No matching applications'}
            </h3>
            <p className="text-gray-600 mb-4">
              {applications.length === 0 
                ? 'Start applying to jobs to see your applications here' 
                : 'Try adjusting your search filters'}
            </p>
            {applications.length === 0 && (
              <a href="/jobs" className="btn btn-primary">
                Browse Jobs
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => (
              <ApplicationCard 
                key={application.application_id} 
                application={application}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}