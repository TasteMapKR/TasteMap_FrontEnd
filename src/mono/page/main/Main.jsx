import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../../component/CourseCard';
import { fetchCoursesByCategory, fetchAllCourses } from '../../api/api';
import './Main.css'; 

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
    const [totalPages, setTotalPages] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const loadCourses = async () => {
        try {
            let data;
            if (selectedCategory === 'ALL') {
                data = await fetchAllCourses(page);
            } else {
                data = await fetchCoursesByCategory(selectedCategory, page);
            }
            setCourses(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching courses:", error.message);
        }
    };

    useEffect(() => {
        loadCourses();
    }, [selectedCategory, page]);

    useEffect(() => {
        const token = localStorage.getItem('Access');
        setIsLoggedIn(!!token);
    }, []); 

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleFetchAllCourses = () => {
        setSelectedCategory('ALL'); // 전체 보기
        setPage(1); // 페이지 리셋
    };

    return (
        <div className="container">
            <div className="action-buttons">
                {isLoggedIn && (
                    <button
                        className="button"
                        title='생성하기'
                        onClick={() => navigate('/create')}
                    >
                        생성하기
                    </button>
                )}
 
            </div>
            
            <div className="category-buttons">
                {categories.map(category => (
                    <button
                        key={category.value}
                        className={`button ${selectedCategory === category.value ? 'active' : ''}`}
                        onClick={() => {
                            setSelectedCategory(category.value);
                            setPage(1); // 페이지 리셋
                        }}
                    >
                        {category.displayName}
                    </button>
                ))}
                <button
                    className="button"
                    onClick={handleFetchAllCourses}
                >
                    전체
                </button>
            </div>

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
                    disabled={page === 1}
                >
                    이전
                </button>
                <span> 페이지 {page} / {totalPages} </span>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                >
                    다음
                </button>
            </div>
        </div>
    );
};

export default Main;
