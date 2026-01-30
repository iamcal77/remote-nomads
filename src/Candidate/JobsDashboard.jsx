import { useState, useEffect } from 'react';
import { 
  Briefcase, Filter, Search, MapPin, Clock, DollarSign, 
  Building, Calendar, ChevronRight, TrendingUp 
} from 'lucide-react';
import { getJobs, applyJob } from '../utils/api';
import JobCard from './JobCard';
import toast from 'react-hot-toast';

export default function JobsDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: 'all',
    experience: 'all',
    salary: 'all',
    location: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, filters]);

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
    let result = jobs;

    // Search filter
    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Job type filter
    if (filters.jobType !== 'all') {
      result = result.filter(job => job.job_type === filters.jobType);
    }

    // Location filter
    if (filters.location) {
      result = result.filter(job =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredJobs(result);
  };

  const handleApply = async (jobId, jobTitle) => {
    try {
      await applyJob(jobId);
      toast.success(`Applied for "${jobTitle}" successfully!`);
      
      // Update local state
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, hasApplied: true } : job
      ));
    } catch (error) {
      toast.error('You have already applied for this job.');
    }
  };

  const stats = {
    totalJobs: jobs.length,
    appliedJobs: jobs.filter(j => j.hasApplied).length,
    matchRate: 85
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
        <p className="text-gray-600 mt-2">Discover remote opportunities from companies worldwide</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Available Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Applied</p>
              <p className="text-2xl font-bold text-gray-900">{stats.appliedJobs}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Match Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.matchRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Filter className="inline h-4 w-4 mr-1" />
                Job Type
              </label>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                className="input-field"
              >
                <option value="all">All Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Salary
              </label>
              <select
                value={filters.salary}
                onChange={(e) => setFilters({...filters, salary: e.target.value})}
                className="input-field"
              >
                <option value="all">Any Salary</option>
                <option value="0-50000">Up to $50k</option>
                <option value="50000-100000">$50k - $100k</option>
                <option value="100000+">$100k+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="inline h-4 w-4 mr-1" />
                Experience
              </label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({...filters, experience: e.target.value})}
                className="input-field"
              >
                <option value="all">Any Experience</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="inline h-4 w-4 mr-1" />
                Location
              </label>
              <input
                type="text"
                placeholder="e.g., Remote, USA"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Positions ({filteredJobs.length})
          </h2>
          <button
            onClick={fetchJobs}
            className="text-sm text-primary-600 hover:text-primary-500 flex items-center"
          >
            Refresh Jobs
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="card text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}