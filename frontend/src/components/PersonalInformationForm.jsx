import React, { useContext, useState } from 'react';
import { User, Calendar, Ruler, Weight, ChevronRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import Footer from "./Footer";

const PersonalInformationForm = () => {
  const { navigate } = useContext(AppContext);
  const [formData, setFormData] = useState({
    gender: '',
    birthDate: '',
    height: 0,
    weight: 0,
    ethnicity: '',
    country: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert height and weight to integers for proper submission
    if (name === 'height' || name === 'weight') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : parseInt(value, 10)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      gender: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setError("");
    
    try {
      // Ensure height and weight are sent as numbers, not strings
      const dataToSubmit = {
        ...formData,
        height: Number(formData.height) || 0,
        weight: Number(formData.weight) || 0
      };
      
      console.log('Submitting data:', dataToSubmit);
      
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/api/user/update', dataToSubmit, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Form submitted:', response.data);
      navigate('/healthConcerns');
    } catch (error) {
      console.error('Error updating personal information:', error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 mb-5">
      <div className="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Personal Information</h2>
            <p className="mt-2 text-gray-600">Help us understand your profile better</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Gender */}
            <div>
              <label className="block text-black font-medium mb-2 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-500" />
                Gender
              </label>
              <div className="flex items-center space-x-6 mt-1">
                <div className="flex items-center">
                  <input
                    id="male"
                    name="gender"
                    type="radio"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="male" className="ml-2 block text-sm text-gray-700">
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="female"
                    name="gender"
                    type="radio"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleRadioChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor="female" className="ml-2 block text-sm text-gray-700">
                    Female
                  </label>
                </div>
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birthDate" className="block text-black font-medium mb-2 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                Birth Date
              </label>
              <input
                type="date"
                name="birthDate"
                id="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Height and Weight side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Height */}
              <div>
                <label htmlFor="height" className="block text-black font-medium mb-2 flex items-center">
                  <Ruler className="h-5 w-5 mr-2 text-blue-500" />
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  id="height"
                  value={formData.height || ''}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="170"
                />
              </div>

              {/* Weight */}
              <div>
                <label htmlFor="weight" className="block text-black font-medium mb-2 flex items-center">
                  <Weight className="h-5 w-5 mr-2 text-blue-500" />
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  value={formData.weight || ''}
                  onChange={handleInputChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="65"
                />
              </div>
            </div>
            
            {/* Empty fields for ethnicity and country */}
            <div className="hidden">
              <input type="hidden" name="ethnicity" value={formData.ethnicity} />
              <input type="hidden" name="country" value={formData.country} />
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-end pt-6">
              <button 
                type="submit" 
                className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition duration-200 font-medium flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Next'} 
                {!isSubmitting && <ChevronRight className="h-4 w-4 ml-1" />}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PersonalInformationForm;