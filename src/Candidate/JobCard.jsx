import { Link } from "react-router-dom";
import { Building, MapPin, Clock, DollarSign, CheckCircle, Paperclip } from "lucide-react";

export default function JobCard({ job, onApply }) {
  const {
    id,
    title,
    company,
    location,
    job_type,
    salary_range,
    hasApplied
  } = job;

  const handleApply = () => onApply(id, title);

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex items-center space-x-2 text-gray-600">
          <Building className="h-4 w-4" />
          <span>{company}</span>
          <MapPin className="h-4 w-4" />
          <span>{location || 'Remote'}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <Link
            to={`/jobs/${id}`}
            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            View Details
          </Link>

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
