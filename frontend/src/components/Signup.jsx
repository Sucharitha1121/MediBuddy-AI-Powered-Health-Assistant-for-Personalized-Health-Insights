import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import Footer from './Footer';
import photo from './photo.png';
import { AppContext } from '../context/AppContext';

const SignUp = () => {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
  });
  const { navigate } = useContext(AppContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/signup', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        alert('Signup successful!');
        localStorage.setItem('token', response.data.token);
        navigate('/personalInformation');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <div className="h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="flex flex-col md:flex-row w-full h-full rounded-none shadow-lg overflow-hidden">
          {/* Left side */}
          <div className="w-full md:w-2/5 bg-teal-700 p-10 text-white flex flex-col items-center justify-center">
            <div className="mb-6 h-28 w-28">
              <img src={photo} alt="MediBuddy Logo" className="max-h-full max-w-full" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">Welcome to MediBuddy</h2>
            <p className="text-center text-sm md:text-base max-w-xs md:max-w-sm">
              Your AI-powered personal health assistant with secure health data management.
            </p>
          </div>

          {/* Right side */}
          <div className="w-full md:w-3/5 bg-white px-6 py-8 md:px-10 md:py-12 flex flex-col justify-center">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create a new account</h2>
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">Sign in</a>
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-500 text-sm">
                    +91
                  </span>
                  <input
                    id="mobile"
                    name="mobile"
                    type="text"
                    placeholder="Enter your mobile number"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-r-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white bg-orange-500 rounded-md shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
