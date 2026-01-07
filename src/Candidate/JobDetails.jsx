import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJobById, applyJob } from "../utils/api";
import { 
  Briefcase, MapPin, Clock, DollarSign, Calendar, 
  ArrowLeft, Globe, Users, Tag, CheckCircle, 
  Bookmark, Share2, Send, Building, Award, 
  ChevronRight, Heart
} from "lucide-react";
import toast from "react-hot-toast";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const data = await getJobById(id);
      setJob(data);
    } catch (error) {
      console.error("Failed to fetch job:", error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!job) return;
    
    try {
      setApplying(true);
      await applyJob(job.id);
      toast.success(`Successfully applied for "${job.title}"!`);
      
      // Update local state to reflect application
      setJob(prev => ({ ...prev, hasApplied: true }));
    } catch (error) {
      console.error("Failed to apply:", error);
      toast.error(error?.message || "Failed to apply for job");
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = () => {
    // Save job to localStorage or your backend
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    if (saved) {
      // Remove from saved
      const updatedSavedJobs = savedJobs.filter(jobId => jobId !== id);
      localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
      toast.success("Job removed from saved");
    } else {
      // Add to saved
      savedJobs.push(id);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      toast.success("Job saved successfully");
    }
    setSaved(!saved);
  };

  const handleShareJob = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link"));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: '#c13d18' }}></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-all hover:shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)',
              boxShadow: '0 4px 12px rgba(193, 61, 24, 0.25)'
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const skillsArray = job.skills ? job.skills.split(",").map(s => s.trim()) : [];
  const perks = [
    'Flexible Schedule',
    'Health Insurance',
    'Remote Work Options',
    'Professional Development',
    'Stock Options',
    'Unlimited PTO'
  ].slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-10">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Link>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveJob}
                className={`p-2 rounded-lg transition-colors ${saved ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
                title={saved ? "Remove from saved" : "Save job"}
              >
                {saved ? (
                  <Heart className="h-5 w-5 fill-current" />
                ) : (
                  <Heart className="h-5 w-5" />
                )}
              </button>
              
              <button
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                title="Share job"
                onClick={handleShareJob}
              >
                <Share2 className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleApply}
                disabled={applying || job.hasApplied}
                className="px-6 py-2 text-white rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{
                  background: job.hasApplied 
                    ? '#10B981' 
                    : 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)',
                  boxShadow: job.hasApplied 
                    ? '0 4px 12px rgba(16, 185, 129, 0.25)'
                    : '0 4px 12px rgba(193, 61, 24, 0.25)'
                }}
              >
                {job.hasApplied ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Applied
                  </>
                ) : applying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Applying...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Apply Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div 
                  className="h-20 w-20 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(193, 61, 24, 0.1)' }}
                >
                  <Building className="h-10 w-10" style={{ color: '#c13d18' }} />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building className="h-4 w-4" />
                          <span className="font-medium">{job.client_name || job.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="h-4 w-4" />
                          <span>{job.timezone || "Any Timezone"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-[#c13d18] to-[#e04e1a] text-white px-4 py-2 rounded-lg font-semibold">
                      ${job.salary_range?.replace(/[^0-9]/g, '') || "Competitive"}
                      <span className="text-sm font-normal ml-1">/year</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase className="h-5 w-5" style={{ color: '#c13d18' }} />
                Job Description
              </h2>
              
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
              
              {/* Requirements Section */}
              {skillsArray.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                  <div className="flex flex-wrap gap-3">
                    {skillsArray.map((skill, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                        style={{
                          backgroundColor: 'rgba(193, 61, 24, 0.1)',
                          color: '#c13d18',
                          border: '1px solid rgba(193, 61, 24, 0.2)'
                        }}
                      >
                        <CheckCircle className="h-3 w-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Perks & Benefits Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="h-5 w-5" style={{ color: '#c13d18' }} />
                Perks & Benefits
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {perks.map((perk, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(193, 61, 24, 0.1)' }}>
                      <CheckCircle className="h-4 w-4" style={{ color: '#c13d18' }} />
                    </div>
                    <span className="text-gray-700">{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Job Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Calendar className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Posted Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(job.posted_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Clock className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className={`font-medium ${job.expiry_date && new Date(job.expiry_date) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                      {job.expiry_date ? new Date(job.expiry_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : "No expiry"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Tag className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium text-gray-900">{job.industry || "Not specified"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Briefcase className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Job Type</p>
                    <p className="font-medium text-gray-900">{job.job_type || "Full-time"}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <Users className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience Level</p>
                    <p className="font-medium text-gray-900">{job.experience_level || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Card */}
            <div 
              className="rounded-2xl p-6 text-white"
              style={{
                background: 'linear-gradient(135deg, #c13d18 0%, #e04e1a 100%)',
                boxShadow: '0 8px 25px rgba(193, 61, 24, 0.3)'
              }}
            >
              <h3 className="text-lg font-bold mb-2">Ready to Apply?</h3>
              <p className="text-white/90 mb-6">
                Submit your application now and take the next step in your career.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleApply}
                  disabled={applying || job.hasApplied}
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {job.hasApplied ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Already Applied
                    </>
                  ) : applying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Apply Now
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleSaveJob}
                  className="w-full bg-transparent border-2 border-white text-white hover:bg-white/10 px-4 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {saved ? (
                    <>
                      <Heart className="h-4 w-4 fill-current" />
                      Remove from Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      Save for Later
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-white/80 text-sm">
                  <span className="font-semibold">Quick apply</span> – Your profile will be automatically submitted
                </p>
              </div>
            </div>

            {/* Similar Jobs Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Jobs</h3>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Link
                    key={i}
                    to={`/jobs/${i}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-[#c13d18] transition-colors">
                          {job.industry} Developer
                        </h4>
                        <p className="text-sm text-gray-500">Remote • Full-time</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#c13d18] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
              
              <Link
                to="/jobs"
                className="mt-4 text-center block text-[#c13d18] hover:text-[#e04e1a] font-medium text-sm transition-colors"
              >
                View all similar jobs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}