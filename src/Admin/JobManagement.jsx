import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar, DollarSign, MapPin, Clock, Briefcase, Filter, Download, Users, ChevronDown } from 'lucide-react';
import { getJobs, createJob, deleteJob, updateJobStatus } from '../utils/api';
import toast from 'react-hot-toast';
import JobForm from './JobForm';

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    client_name: '',
    industry: '',
    skills: '',
    salary_range: '',
    timezone: '',
    expiry_date: '',
    location: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, selectedStatus, selectedType]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await getJobs();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      toast.error('Failed to load jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(job => job.status === selectedStatus);
    }

    // Job type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(job => job.job_type === selectedType);
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'title':
          return a.title?.localeCompare(b.title);
        case 'applications':
          return (b.application_count || 0) - (a.application_count || 0);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const jobData = { ...jobForm };

    if (editingJob) {
      // If only status changed
      if (jobData.status && jobData.status !== editingJob.status && Object.keys(jobData).length === 1) {
        await updateJobStatus(editingJob.id, { status: jobData.status });
        toast.success('Job status updated successfully');
      }
    } else {
      await createJob(jobData);
      toast.success('Job created successfully');
    }

    setShowModal(false);
    resetForm();
    fetchJobs();
  } catch (error) {
    toast.error(error.message || 'Failed to save job');
  }
};

  const handleEdit = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || '',
      company: job.company || '',
      location: job.location || 'Remote',
      job_type: job.job_type || 'full_time',
      salary_range: job.salary_range || '',
      description: job.description || '',
      industry: job.industry || '',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || ''),
      expiry_date: job.expiry_date || '',
      status: job.status || 'draft'
    });
    setShowModal(true);
  };

  const handleDelete = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
      return;
    }

    try {
      await deleteJob(jobId);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const resetForm = () => {
    setJobForm({
      title: '',
      company: '',
      location: 'Remote',
      job_type: 'full_time',
      salary_range: '',
      description: '',
      industry: '',
      skills: '',
      expiry_date: '',
      status: 'draft'
    });
    setEditingJob(null);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800 border border-green-200',
      draft: 'bg-gray-100 text-gray-800 border border-gray-200',
      on_hold: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      filled: 'bg-blue-100 text-blue-800 border border-blue-200',
      archived: 'bg-red-100 text-red-800 border border-red-200'
    };
    
    const labels = {
      active: 'Active',
      draft: 'Draft',
      on_hold: 'On Hold',
      filled: 'Filled',
      archived: 'Archived'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${status === 'active' ? 'bg-green-500' : status === 'draft' ? 'bg-gray-500' : status === 'on_hold' ? 'bg-yellow-500' : status === 'filled' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getJobTypeBadge = (type) => {
    const styles = {
      full_time: 'bg-purple-100 text-purple-800 border border-purple-200',
      part_time: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      contract: 'bg-pink-100 text-pink-800 border border-pink-200',
      freelance: 'bg-cyan-100 text-cyan-800 border border-cyan-200'
    };
    
    const labels = {
      full_time: 'Full Time',
      part_time: 'Part Time',
      contract: 'Contract',
      freelance: 'Freelance'
    };
    
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
        {labels[type] || type}
      </span>
    );
  };

  // Calculate stats
  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.status === 'active').length,
    applications: jobs.reduce((sum, job) => sum + (job.application_count || 0), 0),
    remote: jobs.filter(j => j.location?.toLowerCase().includes('remote')).length
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600 mt-1">Manage job postings and applications</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 text-white rounded-lg font-medium flex items-center gap-2 transition-all hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)',
              boxShadow: '0 4px 12px rgba(193, 61, 24, 0.25)'
            }}
          >
            <Plus className="h-4 w-4" />
            Add New Job
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(193, 61, 24, 0.1)' }}>
              <Briefcase className="h-5 w-5" style={{ color: '#c13d18' }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-100">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.applications}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Remote Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.remote}</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-100">
              <MapPin className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
              style={{ focusRingColor: '#c13d18' }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent appearance-none bg-white min-w-[140px]"
                style={{ focusRingColor: '#c13d18' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="on_hold">On Hold</option>
                <option value="filled">Filled</option>
                <option value="archived">Archived</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent min-w-[140px]"
              style={{ focusRingColor: '#c13d18' }}
            >
              <option value="all">All Types</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent min-w-[140px]"
              style={{ focusRingColor: '#c13d18' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Sort by Title</option>
              <option value="applications">Most Applications</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#c13d18' }}></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Eye className="h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-2 text-gray-600">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="mt-4 px-4 py-2 text-white rounded-lg font-medium transition-all hover:shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)',
                boxShadow: '0 4px 12px rgba(193, 61, 24, 0.25)'
              }}
            >
              Create Your First Job
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Job Details</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Expires</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Applications</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job, index) => (
                  <tr 
                    key={job.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(193, 61, 24, 0.1)' }}
                        >
                          <Briefcase className="h-5 w-5" style={{ color: '#c13d18' }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{job.title}</h4>
                            {getJobTypeBadge(job.job_type)}
                          </div>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-500">{job.industry || 'General'}</span>
                            {job.salary_range && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                  <DollarSign className="h-3 w-3" />
                                  {job.salary_range}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-700 font-medium">{job.client_name || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{job.location || 'Remote'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm ${job.expiry_date && new Date(job.expiry_date) < new Date() ? 'text-red-600' : 'text-gray-700'}`}>
                          {formatDate(job.expiry_date)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100">
                          <Eye className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{job.application_count || 0}</span>
                        <span className="text-xs text-gray-500">applicants</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(job)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Edit job"
                        >
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id, job.title)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete job"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors" title="View details">
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination/Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
        <p>Showing <span className="font-semibold">{filteredJobs.length}</span> of <span className="font-semibold">{jobs.length}</span> jobs</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            1
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-100 font-medium">
            2
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            3
          </button>
          <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-xl w-full max-w-2xl shadow-2xl animate-in fade-in duration-300 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingJob ? 'Edit Job' : 'Create New Job'}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingJob ? 'Update job information' : 'Fill in the details to create a new job posting'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <JobForm
              jobForm={jobForm}
              setJobForm={setJobForm}
              editingJob={editingJob}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowModal(false);
                resetForm();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}