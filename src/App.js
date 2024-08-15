import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './mono/page/Login';
import Main from './mono/page/Main';
import RedirectHandler from './mono/page/RedirectHandler'; 
import Course from './mono/page/Course';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/redirect" element={<RedirectHandler />} />
                <Route path="/" element={<Main />} />
                <Route path="/course" element={<Course />} />
            </Routes>
        </Router>
    );
};

export default App;