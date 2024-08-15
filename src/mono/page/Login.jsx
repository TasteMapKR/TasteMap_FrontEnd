import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const handleNaverLogin = () => {
        // 네이버 로그인 URL로 리다이렉트
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
    };

    const handleGoogleLogin = () => {
        // 구글 로그인 URL로 리다이렉트
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div>
            <h1>Login Page</h1>
            <button onClick={handleNaverLogin}>Login with Naver</button>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    );
};

export default Login;
