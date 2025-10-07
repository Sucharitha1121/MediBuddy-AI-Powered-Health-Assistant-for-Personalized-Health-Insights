import React, { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MedicalRecordsUpload = () => {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setStatus(null);
      setIsProcessed(false);
      setExtractedData(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus({ type: "error", message: "Please select a file first." });
      return;
    }

    setIsLoading(true);
    setStatus(null);
    setIsProcessed(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const isPDF = file.name.toLowerCase().endsWith('.pdf');
      const endpoint = isPDF ? "http://localhost:5002/upload" : "http://localhost:8001/ocr";
      
      setStatus({ type: "info", message: `Extracting data from ${isPDF ? 'PDF' : 'image'}...` });

      // Process file with appropriate service
      const processResponse = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        
      });

      const processedData = processResponse.data;
      console.log("Processed Data:", processedData);
      
      // Prepare extracted text
      let extractedText = '';
      let displayText = '';

      // Handle different possible data structures
      if (processedData.data) {
        // If data exists directly
        if (typeof processedData.data === 'object') {
          displayText = JSON.stringify(processedData.data, null, 2);
          extractedText = JSON.stringify(processedData.data);
        } else {
          displayText = processedData.data;
          extractedText = processedData.data;
        }
      } else if (processedData.extracted_text) {
        // Fallback to extracted_text
        displayText = processedData.extracted_text;
        extractedText = processedData.extracted_text;
      } else {
        // Last resort: stringify entire response
        displayText = JSON.stringify(processedData, null, 2);
        extractedText = JSON.stringify(processedData);
      }

      setExtractedData({
        extracted_text: displayText,
        is_pdf: isPDF,
        raw_response: processedData
      });

      // Store in backend
      setStatus({ type: "info", message: "Storing data securely..." });
      const token = localStorage.getItem("token");
      
      await axios.post("http://localhost:8080/api/healthdata/store", {
        extracted_text: extractedText,
        file_name: file.name
      }, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        timeout: 10000 // 10 seconds timeout for API
      });

      setStatus({ 
        type: "success", 
        message: `Medical data ${isPDF ? 'processed with AI' : 'extracted'} and stored successfully!` 
      });
      setIsProcessed(true);
    } catch (error) {
      console.error("Full Error:", error);
      
      let errorMessage = "An error occurred during processing";
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          errorMessage = error.response.data?.message || 
                        error.response.data?.error || 
                        `Server responded with ${error.response.status}`;
          console.error("Response Error:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = "No response from server. Please check your connection.";
        } else {
          // Something happened in setting up the request
          errorMessage = error.message;
        }
      } else {
        errorMessage = error.message;
      }

      setStatus({ 
        type: "error", 
        message: `Error: ${errorMessage}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Medical Records Upload</h2>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center hover:border-blue-500 transition-colors">
        <input
          type="file"
          id="fileUpload"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label htmlFor="fileUpload" className="cursor-pointer block">
          <Upload className="w-12 h-12 mx-auto mb-3 text-blue-500" />
          <p className="text-gray-700 font-medium mb-1">
            {file ? file.name : "Drag & drop your file here or click to browse"}
          </p>
          <p className="text-sm text-gray-500">
            {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supported formats: PDF, JPG, PNG"}
          </p>
        </label>
      </div>
      
      <div className="mb-6">
        <button
          onClick={handleUpload}
          disabled={isLoading || !file}
          className={`w-full py-3 px-4 rounded-md flex items-center justify-center ${
            !file || isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          } transition-colors`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Upload & Process Document
            </>
          )}
        </button>
      </div>
      
      {status && (
        <div 
          className={`p-4 mb-6 rounded-md flex items-start ${
            status.type === "success" ? "bg-green-50 text-green-800" :
            status.type === "error" ? "bg-red-50 text-red-800" :
            "bg-blue-50 text-blue-800"
          }`}
        >
          {status.type === "success" ? <CheckCircle className="w-5 h-5 mr-3 mt-0.5" /> :
           status.type === "error" ? <AlertCircle className="w-5 h-5 mr-3 mt-0.5" /> :
           <Upload className="w-5 h-5 mr-3 mt-0.5" />}
          <p>{status.message}</p>
        </div>
      )}
      
      {extractedData && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            {extractedData.is_pdf ? "AI-Processed Data" : "Extracted Text"}
          </h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-64 mb-6">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {extractedData.extracted_text}
            </pre>
          </div>
        </div>
      )}

      {isProcessed && (
        <div className="mt-6">
          <button
            onClick={navigateToDashboard}
            className="w-full py-3 px-4 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <span>Next: View in Dashboard</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsUpload;