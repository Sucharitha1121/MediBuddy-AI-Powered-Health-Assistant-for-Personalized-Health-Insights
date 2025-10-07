import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const HealthConcerns = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [startDate, setStartDate] = useState("");
  const [worseningFactors, setWorseningFactors] = useState("");
  const [previousSymptoms, setPreviousSymptoms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents form from reloading the page
    
    setIsSubmitting(true);
    setError("");
    
    // try {
    //   // Get the authentication token from localStorage
    //   const token = localStorage.getItem('token');
      
    //   if (!token) {
    //     throw new Error('Authentication token not found. Please log in again.');
    //   }
      
    //   // Create the payload
    //   const healthConcernsData = {
    //     symptoms,
    //     startDate,
    //     worseningFactors,
    //     previousSymptoms
    //   };
      
    //   // Send data to backend with proper URL scheme and auth token
    //   const response = await fetch('http://localhost:8080/api/health-concerns', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${token}` // Add the token to the Authorization header
    //     },
    //     body: JSON.stringify(healthConcernsData)
    //   });
      
    //   if (!response.ok) {
    //     // Handle different error status codes
    //     if (response.status === 401) {
    //       // Unauthorized - token might be expired
    //       localStorage.removeItem('token'); // Clear the invalid token
    //       navigate('/login', { state: { message: 'Your session has expired. Please log in again.' } });
    //       return;
    //     }
        
    //     const errorData = await response.json().catch(() => ({}));
    //     throw new Error(errorData.message || 'Failed to save health concerns data');
      // }

      
      // Navigate to next page on success
      navigate("/medical-records");
    
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Health Concerns
            </h2>
            <p className="mt-2 text-gray-600">
              Please describe your current health issues in detail
            </p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <p className="text-black font-medium mb-2">What symptoms are you experiencing?</p>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms"
                  required
                />
              </div>
              
              <div>
                <p className="text-black font-medium mb-2">When did they start?</p>
                <input
                  type="date"
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="lg:col-span-2">
                <p className="text-black font-medium mb-2">What makes the symptoms worse?</p>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  value={worseningFactors}
                  onChange={(e) => setWorseningFactors(e.target.value)}
                  placeholder="Describe factors that worsen your symptoms"
                />
              </div>
              
              <div className="lg:col-span-2">
                <p className="text-black font-medium mb-2">Have you experienced similar symptoms before?</p>
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  value={previousSymptoms}
                  onChange={(e) => setPreviousSymptoms(e.target.value)}
                  placeholder="Describe any previous occurrences of similar symptoms"
                />
              </div>
            </div>
            
            <div className="flex justify-between pt-6">
              <button
                type="button"
                className="bg-gray-200 text-blue-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition duration-200"
                onClick={() => navigate("/personalInformation")}
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HealthConcerns;