import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, MessageCircle, Home } from 'lucide-react';

const ThankYouPage = () => {
    const navigate = useNavigate();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        setTimeout(() => setAnimate(true), 100);
    }, []);

    const handleContinueChat = () => {
        navigate('/dashboard');
    };

    

    return (
        <div className="bg-gray-50 flex justify-center items-center min-h-screen p-4 text-gray-800">
            <div className={`bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full transform transition-all duration-500 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <div className="mb-8 flex justify-center">
                    <div className={`relative w-20 h-20 flex items-center justify-center transition-all duration-700 ${animate ? 'scale-100' : 'scale-0'}`}>
                        <div className="w-20 h-20 rounded-full bg-green-100 absolute"></div>
                        <div className="w-16 h-16 rounded-full bg-green-200 absolute"></div>
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center absolute">
                            <Check className="text-white w-6 h-6" />
                        </div>
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h1>
                <h2 className="text-xl text-gray-700 mb-4">Your query has been successfully submitted</h2>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                    <p className="text-gray-700">
                        One of our healthcare providers will review your request and respond shortly. You'll receive a notification when they reply.
                    </p>
                </div>
                
                <div className="space-y-3">
                    <button 
                        onClick={handleContinueChat} 
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-300 flex items-center justify-center font-medium"
                    >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        Continue to Chat
                    </button>
                    
                  
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100 text-gray-500 text-sm">
                    <p>
                        If you have any urgent concerns, please contact emergency services.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThankYouPage;