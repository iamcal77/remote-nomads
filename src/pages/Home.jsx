import { Link } from 'react-router-dom';
import { 
  Globe, Briefcase, Users, CheckCircle, ArrowRight, 
  MapPin, Clock, TrendingUp, Star 
} from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: 'Global Opportunities',
      description: 'Access remote jobs from companies worldwide'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Smart Matching',
      description: 'Get matched with jobs that fit your skills'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Quick Apply',
      description: 'One-click application with your profile'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Remote First',
      description: 'Work from anywhere, anytime'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      company: 'Tech Corp',
      content: 'Found my dream remote job in 2 weeks! The platform made it so easy to connect with employers.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'StartupXYZ',
      content: 'As a recruiter, I found amazing talent here. The candidate quality is outstanding.',
      rating: 5
    },
    {
      name: 'Emma Rodriguez',
      role: 'UX Designer',
      company: 'Design Studio',
      content: 'The job matching algorithm is spot on. All recommendations were relevant to my skills.',
      rating: 4
    }
  ];

  const stats = [
    { value: '5,000+', label: 'Remote Jobs' },
    { value: '50,000+', label: 'Candidates' },
    { value: '2,000+', label: 'Companies' },
    { value: '85%', label: 'Success Rate' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <Globe className="h-16 w-16 text-primary-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Find Your Perfect
            <span className="text-primary-600"> Remote Job</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with global companies offering remote opportunities. 
            Build your career from anywhere in the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="btn-primary py-3 px-8 text-lg flex items-center justify-center"
            >
              Browse Jobs
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              to="/signup"
              className="btn-secondary py-3 px-8 text-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Remote Nomads
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're building the future of remote work, one connection at a time
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="card text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 rounded-2xl p-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200 -ml-4"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Profile</h3>
            <p className="text-gray-600">
              Build your professional profile with skills, experience, and preferences
            </p>
          </div>

          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary-200 -ml-4"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Jobs</h3>
            <p className="text-gray-600">
              Browse curated remote opportunities matched to your profile
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Apply & Connect</h3>
            <p className="text-gray-600">
              Apply with one click and connect directly with employers
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See what our users have to say about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-gray-600 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 md:p-12 text-center text-white">
        <TrendingUp className="h-12 w-12 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Remote Career?
        </h2>
        <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of professionals who found their dream remote jobs through our platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            to="/jobs"
            className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
        <p className="mt-6 text-primary-100 text-sm">
          No credit card required • Free forever plan
        </p>
      </section>

      {/* Footer CTA */}
      <section className="text-center">
        <div className="flex items-center justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <CheckCircle key={i} className="h-5 w-5 text-green-500 mx-1" />
          ))}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Join Remote Nomads Today
        </h3>
        <p className="text-gray-600 mb-6">
          Your next career opportunity is waiting
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-lg"
        >
          Create your free account
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
      </section>
    </div>
  );
}