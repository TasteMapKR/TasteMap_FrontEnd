import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Course = () => {
    const { id } = useParams(); // URL 파라미터에서 ID를 가져옵니다.
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
    const [course, setCourse] = useState(null);
    const [roots, setRoots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 로컬 스토리지에서 액세스 토큰을 가져옵니다.
        const token = localStorage.getItem('Access');
        
        // API 호출
        axios.get(`http://localhost:8080/api/course/${id}`, {
            headers: {
                'access': `${token}`
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

    // 동적으로 이미지 URL을 생성합니다.
    const courseImageUrl = `https://quddaztestbucket.s3.ap-northeast-2.amazonaws.com/course/${id}`;
    const profileImageUrl = course?.profile_image;
    const rootImageUrls = roots.map((_, index) => `https://quddaztestbucket.s3.ap-northeast-2.amazonaws.com/root/${id}/${index + 1}`);

    return (
        <div>
            <h1>{course?.title}</h1>
            <img src={courseImageUrl} alt="코스 이미지" width="100%" />
            <p>카테고리: {course?.category}</p>
            <p>내용: {course?.content}</p>
            <h2>강사</h2>
            <p>이름: {course?.name}</p>
            <img src={profileImageUrl} alt="프로필 이미지" width="100" />

            <h2>루트</h2>
            {roots.length > 0 ? (
                <ul>
                    {roots.map((root, index) => (
                        <li key={index}>
                            <h3>{root.title}</h3>
                            <p>내용: {root.content}</p>
                            <p>주소: {root.address}</p>
                            <img src={rootImageUrls[index]} alt={`루트 ${index + 1}`} width="100" />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>루트가 없습니다.</p>
            )}

            {/* 업데이트 버튼 추가 */}
            <button onClick={() => navigate(`/update/${id}`)}>코스 업데이트</button>
        </div>
    );
};

export default Course;
