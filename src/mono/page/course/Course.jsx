import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import MapComponent from '../../component/MapComponent';
import './Course.css';

const Course = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [roots, setRoots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [focusedIndex, setFocusedIndex] = useState(0);

    // 로컬 스토리지에서 Name 가져오기
    const localStorageName = localStorage.getItem('Name');

    useEffect(() => {
        const token = localStorage.getItem('Access');

        axios.get(`http://localhost:8080/api/course/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Access 토큰을 헤더에 포함
            }
        })
        .then(response => {
            setCourse(response.data.data.course);
            setRoots(response.data.data.roots);
        })
        .catch(err => {
            setError('데이터를 불러오는 데 실패했습니다.');
            console.error(err);
        })
        .finally(() => {
            setLoading(false);
        });
    }, [id]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p>{error}</p>;

    const courseImageUrl = `https://quddaztestbucket.s3.ap-northeast-2.amazonaws.com/course/${id}`;
    const profileImageUrl = course?.profile_image;
    const rootImageUrls = roots.map((_, index) => `https://quddaztestbucket.s3.ap-northeast-2.amazonaws.com/root/${id}/${index + 1}`);

    // 수정 버튼 표시 여부 결정
    const showEditButton = localStorageName === course?.name;

    return (
        <div className="course-container">
            <div className="course-header">
                <div className="course-image-container">
                    <img src={courseImageUrl} alt="코스 이미지" className="course-image" />
                    <div className="overlay">
                        <div className="course-info">
                            <h1>
                                {course?.title}
                                <button className="review-button" onClick={() => navigate(`/course/${id}/feedback`)}>리뷰</button>
                            </h1>
                            <div className="course-category">#{course?.category}</div>
                            <div className="profile-info">
                                <img src={profileImageUrl} alt="프로필 이미지" className="profile-image" />
                                <p className="course-name">{course?.name}</p>
                            </div>
                            {showEditButton && (
                                <button className="review-button" onClick={() => navigate(`/update/${id}`)}>수정</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="roots-section">
                <div className="root-details">
                    <div className="root-navigation">
                        {roots.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setFocusedIndex(index)}
                                className={`root-tab ${focusedIndex === index ? 'active' : ''}`}
                            >
                                루트{index + 1}
                            </button>
                        ))}
                    </div>
                    <img src={rootImageUrls[focusedIndex]} alt={`루트 ${focusedIndex + 1}`} className="root-image" />
                    <h3>루트.{focusedIndex + 1} {roots[focusedIndex]?.title}</h3>
                    <p>{roots[focusedIndex]?.content}</p>
                </div>
                <MapComponent addressList={roots.map(root => root.address)} focusedIndex={focusedIndex} />
            </div>
        </div>
    );
};

export default Course;
