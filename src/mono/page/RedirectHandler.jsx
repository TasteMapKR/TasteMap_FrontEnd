import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAccessToken } from './../api/api'; // api.js에서 함수 가져오기

const RedirectHandler = () => {
    const navigate = useNavigate(); 

    const handleTokenRefresh = async () => {
        try {
            const { newAccessToken, name, profile } = await fetchAccessToken();

            if (newAccessToken && name) {
                localStorage.setItem('Access', newAccessToken); 
                localStorage.setItem('Profile', profile);
                localStorage.setItem('Name', name);
                navigate('/'); 
            } else {
                console.error("Failed to reissue Access token. No token received.");
                navigate('/login'); 
            }
        } catch (error) {
            console.error(error.message);
            navigate('/login'); 
        }
    };

    useEffect(() => {
        handleTokenRefresh();
    }, [navigate]);

    return (
        <div>
            <p>Redirecting...</p>
        </div>
    );
};

export default RedirectHandler;
