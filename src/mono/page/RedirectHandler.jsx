import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://localhost:8080";

const RedirectHandler = () => {
    const navigate = useNavigate(); 

    // Access Token을 요청하고 로컬 스토리지에 저장
    const fetchAccessToken = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/refresh`, {}, {
                withCredentials: true // 쿠키를 포함하여 요청
            });

            const newAccessToken = response.headers['access']; // 서버에서 Access 토큰을 헤더에서 추출

            if (newAccessToken) {
                localStorage.setItem('Access', newAccessToken); // 로컬 스토리지에 저장
                console.log("New Access Token:", newAccessToken);
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
