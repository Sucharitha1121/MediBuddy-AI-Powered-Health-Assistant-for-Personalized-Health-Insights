import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Footer from './Footer';
import photo from './photo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        alert('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2"> {/* Reduced padding here */}
        <div className="flex flex-col md:flex-row w-full max-w-6xl rounded-lg shadow-2xl overflow-hidden bg-white mx-2 my-2"> {/* Reduced margin here */}
          {/* Left side - Teal background with logo and welcome text */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white flex flex-col items-center justify-center"> {/* Reduced padding here */}
            <div className="mb-6 h-28 w-28">
              <img src={photo} alt="MediBuddy Logo" className="max-h-full max-w-full" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Welcome to MediBuddy</h2>
            <p className="text-center text-sm md:text-base max-w-xs md:max-w-sm">
              Your AI-powered personal health assistant with secure health data management.
            </p>
          </div>

          {/* Right side - Form content */}
          <div className="w-full md:w-3/5 bg-white px-6 py-8 md:px-8 md:py-10 flex flex-col justify-center"> {/* Reduced padding here */}
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Sign in to your account
              </h2>
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Sign up
                </a>
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;