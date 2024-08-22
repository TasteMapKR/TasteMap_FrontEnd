import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://localhost:8080";

const RedirectHandler = () => {
    const navigate = useNavigate(); 

    const fetchAccessToken = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/refresh`, {}, {
                withCredentials: true
            });

            const newAccessToken = response.headers['access']; 
            const { name } = response.data;
            
            if (newAccessToken && name) {
                localStorage.setItem('Access', newAccessToken); 
                
                localStorage.setItem("Name", name);
                navigate('/'); 
            } else {
                console.error("Failed to reissue Access token. No token received.");
                navigate('/login'); 
            }
        } catch (error) {
            console.error("Error reissuing Access token:", error.response ? error.response.data : error.message);
            navigate('/login'); ;
        }
    };

    useEffect(() => {
        fetchAccessToken();
    }, [navigate]);

    return (
        <div>
            <p>Redirecting...</p>
        </div>
    );
};

export default RedirectHandler;
