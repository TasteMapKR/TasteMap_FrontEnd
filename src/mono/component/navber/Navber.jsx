import React, { useState, useEffect } from 'react';
import './Navber.css'; 
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
    const [userProfile, setUserProfile] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('Access');
        const storedProfile = localStorage.getItem('Profile');
        if (storedToken && storedProfile) {
            setIsLoggedIn(true);
            setUserProfile(storedProfile);
        } else {
            setIsLoggedIn(false);
            setUserProfile('');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('Access');
        localStorage.removeItem('Profile');
        localStorage.removeItem('Name');
        setIsLoggedIn(false);
        setUserProfile('');
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
                    <>
                        <img src={userProfile} alt="Profile" className="user-profile" /> {/* 프로필 이미지 표시 */}
                        <button className="login-button" onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <button className="login-button" onClick={handleLogin}>로그인</button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
