import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, AlertCircle } from "lucide-react";

export default function AskDoctorForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    healthConcern: "",
    unresolvedIssues: "",
    file: null,
  });
  const [errors, setErrors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData({ ...formData, file: e.dataTransfer.files[0] });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.healthConcern.trim()) {
      newErrors.healthConcern = "Please describe your health concern";
    }
    
    if (!formData.unresolvedIssues.trim()) {
      newErrors.unresolvedIssues = "Please describe unresolved issues";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log("Form submitted:", formData);
        setIsSubmitting(false);
        navigate("/handle");
      }, 1000);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen px-4 py-6">
      <div className="w-full max-w-3xl p-6 bg-white shadow-lg rounded-lg">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mr-3">
            M
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Ask a Doctor</h1>
        </div>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            Volunteer healthcare providers who support MediBuddy's mission are available to provide feedback on your questions.
          </p>
        </div>
        
        <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-100 flex items-start">
          <AlertCircle className="text-amber-500 mr-2 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-amber-800">
            If you have an urgent medical issue, please visit a hospital immediately. This service does not provide complete diagnoses.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Please describe your health concern <span className="text-red-500">*</span>
            </label>
            <textarea
              name="healthConcern"
              rows="4"
              className={`block w-full px-3 py-2 border ${
                errors.healthConcern ? "border-red-500 bg-red-50" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="Describe your symptoms, when they started, and any relevant medical history..."
              value={formData.healthConcern}
              onChange={handleChange}
            ></textarea>
            {errors.healthConcern && (
              <p className="mt-1 text-sm text-red-600">{errors.healthConcern}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What issues weren't resolved through the AI chat? <span className="text-red-500">*</span>
            </label>
            <textarea
              name="unresolvedIssues"
              rows="4"
              className={`block w-full px-3 py-2 border ${
                errors.unresolvedIssues ? "border-red-500 bg-red-50" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
              placeholder="What questions do you still have that the AI couldn't answer?"
              value={formData.unresolvedIssues}
              onChange={handleChange}
            ></textarea>
            {errors.unresolvedIssues && (
              <p className="mt-1 text-sm text-red-600">{errors.unresolvedIssues}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Do you have any relevant files or test results to share?
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 border-dashed"
              } rounded-md transition-colors duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-2 text-center">
                {formData.file ? (
                  <div className="flex flex-col items-center">
                    <FileText className="h-10 w-10 text-blue-500" />
                    <p className="text-sm text-gray-700 mt-2">{formData.file.name}</p>
                    <button
                      type="button"
                      className="mt-2 text-sm text-red-600 hover:text-red-800"
                      onClick={() => setFormData({ ...formData, file: null })}
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Click to upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, PNG, JPG up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
          
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Return to chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}