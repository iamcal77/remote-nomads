import { 
  Building, MapPin, Clock, DollarSign, Calendar, 
  Briefcase, Paperclip, CheckCircle 
} from 'lucide-react';

export default function JobCard({ job, onApply }) {
  const {
    id,
    title,
    company,
    location,
    job_type,
    salary_range,
    description,
    posted_date,
    expiry_date,
    hasApplied,
    is_featured,
    industry,
    skills
  } = job;

  // Ensure skills is always an array
  const skillsArray = Array.isArray(skills)
    ? skills
    : skills
      ? skills.split(',').map(s => s.trim())
      : [];

  const handleApply = () => {
    onApply(id, title);
  };

  return (
    <div className={`card hover:shadow-lg transition-shadow duration-200 ${is_featured ? 'border-l-4 border-primary-500' : ''}`}>
      {is_featured && (
        <div className="absolute top-4 right-4">
          <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            Featured
          </span>
        </div>
      )}

      <div className="space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <div className="flex items-center mt-1 space-x-2">
                <div className="flex items-center text-gray-600">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{company}</span>
                </div>
                {industry && (
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {industry}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{location || 'Remote'}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{job_type?.replace('_', ' ').toUpperCase() || 'Full Time'}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{salary_range || 'Competitive'}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Posted {new Date(posted_date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 line-clamp-3">
          {description || 'No description available'}
        </p>

        {/* Skills */}
        {skillsArray.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skillsArray.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {skillsArray.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{skillsArray.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {expiry_date && (
              <span>Apply by {new Date(expiry_date).toLocaleDateString()}</span>
            )}
          </div>
          
          <button
            onClick={handleApply}
            disabled={hasApplied}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              hasApplied
                ? 'bg-green-100 text-green-800 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {hasApplied ? (
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2" />
                Applied
              </span>
            ) : (
              <span className="flex items-center">
                <Paperclip className="h-4 w-4 mr-2" />
                Apply Now
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
