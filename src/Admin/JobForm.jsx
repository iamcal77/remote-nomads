import React from 'react';
import { Calendar } from 'lucide-react';

export default function JobForm({ jobForm, setJobForm, editingJob, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title *
          </label>
          <input
            type="text"
            required
            value={jobForm.title}
            onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
            className="input-field"
            placeholder="Senior Backend Engineer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Name *
          </label>
          <input
            type="text"
            required
            value={jobForm.client_name}
            onChange={(e) => setJobForm({ ...jobForm, client_name: e.target.value })}
            className="input-field"
            placeholder="Remote Nomads Ltd"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={jobForm.location}
            onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
            className="input-field"
            placeholder="Kenya, Remote, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <input
            type="text"
            value={jobForm.industry}
            onChange={(e) => setJobForm({ ...jobForm, industry: e.target.value })}
            className="input-field"
            placeholder="Technology"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <input
            type="text"
            value={jobForm.timezone}
            onChange={(e) => setJobForm({ ...jobForm, timezone: e.target.value })}
            className="input-field"
            placeholder="UTC+3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salary Range
          </label>
          <input
            type="text"
            value={jobForm.salary_range}
            onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
            className="input-field"
            placeholder="$4,000 - $6,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            value={jobForm.expiry_date}
            onChange={(e) => setJobForm({ ...jobForm, expiry_date: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Required Skills
        </label>
        <input
          type="text"
          value={jobForm.skills}
          onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
          className="input-field"
          placeholder="Python, FastAPI, PostgreSQL, Docker, Kubernetes"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Job Description *
        </label>
        <textarea
          required
          value={jobForm.description}
          onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
          className="input-field h-32"
          placeholder="Detailed job description..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {editingJob ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
}
