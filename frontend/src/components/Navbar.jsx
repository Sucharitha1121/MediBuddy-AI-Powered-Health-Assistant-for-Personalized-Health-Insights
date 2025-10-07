import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import photo from './photo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const App = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Call the backend logout endpoint
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            const response = await axios.post(
                'http://localhost:8080/api/logout',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                // Clear the token from localStorage
                localStorage.removeItem('token');

                // Navigate to the home page
                navigate('/');
            } else {
                console.error('Logout failed:', response.data);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <div className="bg-white text-gray-800">
            <header className="bg-blue-500 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <img src={photo} alt="MediBuddy Logo" className="h-10 w-10 mr-2" />
                        <h1 className="text-2xl font-bold">MediBuddy</h1>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <a
                            className="hover:underline cursor-pointer"
                            onClick={() => navigate('/medical-records')}
                        >
                            Upload Report
                        </a>
                        <a
                            className="hover:underline"
                            href="https://discord.gg/CG8gm6a3"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Community Support
                        </a>
                        <a
                            className="hover:underline cursor-pointer"
                            onClick={handleLogout}
                            title="Log Out"
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </a>
                    </nav>
                </div>
            </header>
        </div>
    );
};

export default App;