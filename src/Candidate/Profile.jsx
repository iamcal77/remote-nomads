import { useState, useEffect } from 'react';
import { User, Mail, Phone, Briefcase, MapPin, DollarSign } from 'lucide-react';
import { updateProfile, getProfile } from '../utils/api';
import toast from 'react-hot-toast';

export default function Profile() {
 const [profile, setProfile] = useState({
  full_name: '',
  email: '',
  industry: '',
  timezone: '',
  skills: '',
  salary_expectation: '',
  cv: null
});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

const fetchProfile = async () => {
  try {
    const data = await getProfile();

    setProfile((prev) => ({
      ...prev,
      full_name: data.full_name || '',
      email: data.email || '',
      industry: data.industry || '',
      timezone: data.timezone || '',
      skills: data.skills || '',
      salary_expectation: data.salary_expectation || ''
    }));
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('full_name', profile.full_name);
    formData.append('industry', profile.industry);
    formData.append('timezone', profile.timezone);
    formData.append('skills', profile.skills);
    formData.append('salary_expectation', profile.salary_expectation);

    if (profile.cv) {
      formData.append('cv', profile.cv);
    }

    await updateProfile(formData);
    toast.success('Profile updated successfully!');
  } catch (error) {
    toast.error('Failed to update profile');
  } finally {
    setLoading(false);
  }
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setProfile((prev) => ({ ...prev, [name]: value }));
};

const handleFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setProfile((prev) => ({ ...prev, cv: e.target.files[0] }));
  }
};


  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Update your personal and professional information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="card space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={profile.full_name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John Doe"
                />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="input-field bg-gray-100"
                />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="inline h-4 w-4 mr-1" />
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  value={profile.industry}
                  onChange={handleChange}
                  className="input-field"
                />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Timezone
                </label>
                <input
                  type="text"
                  name="timezone"
                  value={profile.timezone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="EAT (UTC+3)"
                />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Salary Expectation
                </label>
                <input
                  type="text"
                  name="salary_expectation"
                  value={profile.salary_expectation}
                  onChange={handleChange}
                  className="input-field"
                />

              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills
              </label>
              <textarea
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                className="input-field h-32"
              />

              <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CV
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="input-field"
              />
              {profile.cv && (
                <p className="text-sm text-gray-600 mt-1">Selected file: {profile.cv.name}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Completeness</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Profile Strength</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}