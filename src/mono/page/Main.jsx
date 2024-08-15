import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

const Main = () => {
    const categories = [
        { value: 'DESSERT', displayName: '디저트' },
        { value: 'MEAL', displayName: '식사' },
        { value: 'MIXED', displayName: '혼합' }
    ];

    const [selectedCategory, setSelectedCategory] = useState(categories[0].value);
    const [courses, setCourses] = useState([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCoursesByCategory = async (selectedPage = 0) => {
        setLoading(true);
        setError(null);

        try {
            const accessToken = localStorage.getItem('Access'); // Access 토큰을 로컬 스토리지에서 가져옴

            const response = await axios.get(`${API_BASE_URL}/api/course/category`, {
                params: {
                    category: selectedCategory,
                    page: selectedPage,
                    size: size
                },
                headers: {
                    'access': `${accessToken}` // Authorization 헤더에 Access Token 포함
                }
            });

            // 응답 데이터 구조 확인 및 courses 상태 업데이트
            const { content, totalPages } = response.data.data;
            setCourses(content);
            setTotalPages(totalPages);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // Unauthorized, 로그인 필요 메시지 표시
                setError("Access token is invalid or expired. Please log in again.");
            } else {
                console.error("Error fetching courses:", error.response ? error.response.data : error.message);
                setError("Failed to fetch courses.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('Access');
        if (token) {
            fetchCoursesByCategory();
        } else {
            setError("Access token is missing. Please log in again.");
        }
    }, [selectedCategory, page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div>
            <h1>Courses by Category</h1>
            <label>
                Select Category:
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map(category => (
                        <option key={category.value} value={category.value}>
                            {category.displayName}
                        </option>
                    ))}
                </select>
            </label>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {courses.length > 0 ? (
                    courses.map(course => (
                        <li key={course.id}>
                            <h2>{course.title}</h2>
                            <p>Category: {course.category}</p>
                            <p>Name: {course.name}</p>
                            {course.profile_image && <img src={course.profile_image} alt={course.name} />}
                        </li>
                    ))
                ) : (
                    <p>No courses found.</p>
                )}
            </ul>

            <div>
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0 || loading}
                >
                    Previous
                </button>
                <span> Page {page + 1} of {totalPages} </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page + 1 >= totalPages || loading}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Main;
