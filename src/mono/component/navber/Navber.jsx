import React from 'react';
import './Navber.css'; // CSS 파일을 임포트합니다.
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
    // JWT 토큰이 localStorage에 있는지 확인하여 로그인 상태를 확인합니다.
    const isLoggedIn = !!localStorage.getItem('Access');

    const handleLogout = () => {
        // 로그아웃 시 localStorage에서 JWT 토큰을 삭제합니다.
        localStorage.removeItem('Access');
        localStorage.removeItem('Name');
        navigate('/login'); // 로그아웃 후 로그인 페이지로 리다이렉트
    };

    const handleLogin = () => {
        navigate('/login'); // 로그인 페이지로 이동
    };
    const handleHome = () => {
        navigate("/");
    };
    return (
        <div className="navbar">
            <div className="navbar-logo" onClick={handleHome}>
                <img src={`${process.env.PUBLIC_URL}/MainLogo.png`} alt="Logo" className="logo" />
                <span className="navbar-title">TastMap</span>
            </div>
            <div className="navbar-right">
                {isLoggedIn ? (
                    <button className="login-button" onClick={handleLogout}>로그아웃</button>
                ) : (
                    <button className="login-button" onClick={handleLogin}>로그인</button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
