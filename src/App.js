import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './mono/page/Login';
import Main from './mono/page/Main';
import RedirectHandler from './mono/page/RedirectHandler'; 
import Create from './mono/page/Create';
import Course from './mono/page/Course';
import Update from './mono/page/Update';
import Feedback from './mono/page/Feedback';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/redirect" element={<RedirectHandler />} />
                <Route path="/" element={<Main />} />
                <Route path="/create" element={<Create />} />
                <Route path="/course/:id" element={<Course />} />
                <Route path="/update/:id" element={<Update />} />
                <Route path="/course/:id/feedback" element={<Feedback />} />
            </Routes>
        </Router>
    );
};

export default App;