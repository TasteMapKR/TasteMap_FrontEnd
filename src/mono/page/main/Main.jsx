import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseCard from '../../component/CourseCard';
import { useNavigate } from 'react-router-dom';
import './Main.css'; 


const API_BASE_URL = "http://localhost:8080";

const Main = () => {
    const categories = [
        { value: 'DESSERT', displayName: '디저트' },
        { value: 'MEAL', displayName: '식사' },
        { value: 'MIXED', displayName: '혼합' }
    ];

    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(categories[0].value);
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(4);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const fetchCoursesByCategory = async (selectedPage = 1) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/api/course/category`, {
                params: {
                    category: selectedCategory,
                    page: selectedPage - 1,
                    size: size
                }
            });

            const { content, totalPages } = response.data.data;
            setCourses(content);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Error fetching courses:", error.response ? error.response.data : error.message);
            setError("Failed to fetch courses.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoursesByCategory(page);
    }, [selectedCategory, page]);

    useEffect(() => {
        const token = localStorage.getItem('Access');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []); 

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (<div>
        <div >
            {isLoggedIn && (
                <button
                    title='생성하기'
                    onClick={() => navigate('/create')}
                >
                    생성하기
                </button>
            )}
            
            <label>
                카테고리 선택:
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map(category => (
                        <option key={category.value} value={category.value}>
                            {category.displayName}
                        </option>
                    ))}
                </select>
            </label>

            {loading && <p>로딩 중...</p>}
            {error && <p className="error">{error}</p>}

            <div className="courseList">
                {courses.length > 0 ? (
                    courses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))
                ) : (
                    <p>코스가 없습니다.</p>
                )}
            </div>

            <div className="pagination">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1 || loading}
                >
                    이전
                </button>
                <span> 페이지 {page} / {totalPages} </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages || loading}
                >
                    다음
                </button>
            </div>
        </div></div>
    );
};

export default Main;
