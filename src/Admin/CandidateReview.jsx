import { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  X,
  Eye
} from 'lucide-react';
import { getApplications, downloadCv, viewCv,updateApplicationStatus } from '../utils/api';
import toast from 'react-hot-toast';

export default function CandidateReview() {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCv, setSelectedCv] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplications();
      const allowedStatuses = ["pending", "reviewed", "shortlisted", "accepted", "rejected"];

      const normalized = data.map(app => ({
        id: app.application_id,
        job_id: app.job_id,
        job_title: app.job_title || 'N/A',
        status: allowedStatuses.includes(app.status) ? app.status : 'pending',
        applied_at: app.applied_at,
        candidate_name: app.full_name,
        candidate_email: app.email,
        cv_view_url: app.cv_path ? viewCv(app.application_id) : null,
        cv_download_url: app.cv_path ? downloadCv(app.application_id) : null

      }));

      setApplications(normalized);
      setFilteredApplications(normalized);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm.trim()) {
      filtered = filtered.filter(app =>
        app.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.candidate_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus(applicationId, { status: newStatus });
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast.success(`Application marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update application status');
    }
  };

const handleCvClick = (app) => {
  if (app.cv_view_url) {
    setSelectedCv({
      url: app.cv_view_url,
      downloadUrl: app.cv_download_url,
      candidateName: app.candidate_name,
      jobTitle: app.job_title
    });
    setIsModalOpen(true);
  }
};


const handleDownload = () => {
  if (selectedCv?.downloadUrl) {
    window.open(selectedCv.downloadUrl, '_blank');
  }
};


  const getStatusBadge = status => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </span>
        );
      case 'reviewed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Reviewed
          </span>
        );
      case 'shortlisted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Shortlisted
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" /> Rejected
          </span>
        );
      default:
        return status;
    }
  };

  const formatDate = date =>
    date ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : 'N/A';

  // CV Preview Modal
  const CvModal = () => {
    if (!isModalOpen || !selectedCv) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal */}
          <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-50 to-secondary-50 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedCv.candidateName} - CV Preview
                </h3>
                <p className="text-sm text-gray-600">{selectedCv.jobTitle}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* CV Preview Content */}
            <div className="px-6 py-4">
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <div className="aspect-[3/4] w-full overflow-hidden rounded border">
                  <iframe
                    src={selectedCv.url}
                    title="CV Preview"
                    className="w-full h-full"
                    style={{ minHeight: '600px' }}
                  />

                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <CvModal />
      
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Candidate Applications</h1>
              <p className="text-gray-600 mt-1">Review and manage job applications</p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              Total: <span className="font-semibold">{applications.length}</span> applications
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Applications
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email or job title..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchApplications}
                className="w-full px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Refresh Applications
              </button>
            </div>
          </div>
        </div>

        {/* Applications Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading applications...</p>
              </div>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No applications found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      CV
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map(app => (
                    <tr 
                      key={app.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{app.candidate_name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{app.candidate_email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{app.job_title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatDate(app.applied_at)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4">
                        {app.cv_view_url ? (
                          <button
                            onClick={() => handleCvClick(app)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View CV
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">No CV</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {app.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => updateStatus(app.id, 'reviewed')}
                                className="px-3 py-1.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                Mark as Reviewed
                              </button>
                              <button 
                                onClick={() => updateStatus(app.id, 'shortlisted')}
                                className="px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                              >
                                Shortlist
                              </button>
                            </>
                          )}
                          {app.status === 'reviewed' && (
                            <button 
                              onClick={() => updateStatus(app.id, 'shortlisted')}
                              className="px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                            >
                              Shortlist
                            </button>
                          )}
                          {app.status === 'shortlisted' && (
                            <>
                              <button 
                                onClick={() => updateStatus(app.id, 'accepted')}
                                className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-800 rounded-lg hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => updateStatus(app.id, 'rejected')}
                                className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-800 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {(app.status === 'accepted' || app.status === 'rejected') && (
                            <button 
                              onClick={() => updateStatus(app.id, 'pending')}
                              className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                            >
                              Reset to Pending
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Stats */}
        {!loading && filteredApplications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
              <div className="text-sm text-blue-700 font-medium">Pending</div>
              <div className="text-2xl font-bold text-blue-900">
                {applications.filter(a => a.status === 'pending').length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
              <div className="text-sm text-purple-700 font-medium">Shortlisted</div>
              <div className="text-2xl font-bold text-purple-900">
                {applications.filter(a => a.status === 'shortlisted').length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
              <div className="text-sm text-green-700 font-medium">Accepted</div>
              <div className="text-2xl font-bold text-green-900">
                {applications.filter(a => a.status === 'accepted').length}
              </div>
            </div>
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
              <div className="text-sm text-red-700 font-medium">Rejected</div>
              <div className="text-2xl font-bold text-red-900">
                {applications.filter(a => a.status === 'rejected').length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}