import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = () => {
    const navigate = useNavigate();

    const handleNaverLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src={`${process.env.PUBLIC_URL}/MainLogo.png`} alt="Logo" className="login-logo" />
                <button className="Naver-button" onClick={handleNaverLogin}>Login with Naver</button>
                <button className="google-button" onClick={handleGoogleLogin}>Sign up with Google</button>
            </div>
        </div>
    );
};

export default Login;
