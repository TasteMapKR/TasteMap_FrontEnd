import React from 'react';
import './Navber.css'; 
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const isLoggedIn = !!localStorage.getItem('Access');

    const handleLogout = () => {
        localStorage.removeItem('Access');
        localStorage.removeItem('Name');
        navigate('/login'); 
    };

    const handleLogin = () => {
        navigate('/login');
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
