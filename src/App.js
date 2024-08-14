import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Naver 로그인 페이지로 리디렉션
const onNaverLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/naver"; // Naver 로그인으로 리디렉션
}

function App() {
    const [accessToken, setAccessToken] = useState(null); // Access 토큰 상태
    const [loading, setLoading] = useState(false); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [roots, setRoots] = useState([]); // root 항목 상태
    const [courseTitle, setCourseTitle] = useState('');
    const [courseContent, setCourseContent] = useState('');

    // 새로운 Access 토큰을 요청하는 함수
    const handleReissueToken = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post("http://localhost:8080/refresh", {}, {
                withCredentials: true, // 리프레시 토큰 쿠키를 포함
            });

            // 서버가 Access 토큰을 헤더로 반환한다고 가정
            const newAccessToken = response.headers['access']; // 'Access' 헤더에서 토큰 가져오기

            if (newAccessToken) {
                setAccessToken(newAccessToken); // 새로운 Access 토큰 상태에 저장
                localStorage.setItem('Access', newAccessToken); // 로컬 스토리지에 저장
                console.log("New Access Token:", newAccessToken);
            } else {
                console.error("Failed to reissue Access token. No token received.");
                setError("Failed to reissue Access token.");
            }
        } catch (error) {
            console.error("Error reissuing Access token:", error.response ? error.response.data : error.message);
            setError("Error reissuing Access token.");
        } finally {
            setLoading(false);
        }
    };

    // CourseController 엔드포인트를 테스트하는 함수
    const handleTestCourseController = async () => {
        setLoading(true);
        setError(null);

        try {
            const courseData = {
                title: courseTitle,
                content: courseContent,
                roots: roots
            };

            const formData = new FormData();
            formData.append('course', new Blob([JSON.stringify(courseData)], { type: 'application/json' }));
            formData.append('courseImage', new Blob()); // 실제 이미지 파일로 교체
            formData.append('roots', new Blob([JSON.stringify(courseData.roots)], { type: 'application/json' }));
            formData.append('rootImages', new Blob()); // 실제 이미지 파일로 교체

            const response = await axios.post("http://localhost:8080/course", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'access': `${accessToken}` // 액세스 토큰을 헤더에 포함
                }
            });

            console.log("CourseController response:", response.data);
        } catch (error) {
            console.error("Error testing CourseController:", error.response ? error.response.data : error.message);
            setError("Error testing CourseController.");
        } finally {
            setLoading(false);
        }
    };

    // 페이지 로드 시 Access 토큰을 로컬 스토리지에서 읽어 상태에 저장
    useEffect(() => {
        const token = localStorage.getItem('Access');
        if (token) {
            setAccessToken(token);
        }
    }, []);

    // root 항목 추가 함수
    const addRoot = () => {
        if (roots.length < 4) {
            setRoots([...roots, { title: '', content: '', address: '' }]);
        }
    };

    // root 항목 업데이트 함수
    const updateRoot = (index, field, value) => {
        const newRoots = [...roots];
        newRoots[index] = { ...newRoots[index], [field]: value };
        setRoots(newRoots);
    };

    // root 항목 삭제 함수
    const removeRoot = (index) => {
        setRoots(roots.filter((_, i) => i !== index));
    };

    return (
        <>
            <h1>Token Management</h1>
            <button onClick={onNaverLogin}>Naver Login</button>
            <button onClick={handleReissueToken} disabled={loading}>
                {loading ? "Reissuing Token..." : "Reissue Access Token"}
            </button>
            <button onClick={handleTestCourseController} disabled={loading || !accessToken}>
                {loading ? "Testing Course Controller..." : "Test Course Controller"}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {accessToken ? (
                <div>
                    <h2>Current Access Token:</h2>
                    <p>{accessToken}</p>
                </div>
            ) : (
                <p>No Access token available. Please reissue.</p>
            )}
            <div>
                <h2>Course Information</h2>
                <label>
                    Course Title:
                    <input 
                        type="text" 
                        value={courseTitle} 
                        onChange={(e) => setCourseTitle(e.target.value)} 
                    />
                </label>
                <label>
                    Course Content:
                    <textarea 
                        value={courseContent} 
                        onChange={(e) => setCourseContent(e.target.value)} 
                    />
                </label>
                <h3>Roots</h3>
                {roots.map((root, index) => (
                    <div key={index}>
                        <label>
                            Root Title:
                            <input 
                                type="text" 
                                value={root.title} 
                                onChange={(e) => updateRoot(index, 'title', e.target.value)} 
                            />
                        </label>
                        <label>
                            Root Content:
                            <textarea 
                                value={root.content} 
                                onChange={(e) => updateRoot(index, 'content', e.target.value)} 
                            />
                        </label>
                        <label>
                            Root Address:
                            <input 
                                type="text" 
                                value={root.address} 
                                onChange={(e) => updateRoot(index, 'address', e.target.value)} 
                            />
                        </label>
                        <button onClick={() => removeRoot(index)}>Remove Root</button>
                    </div>
                ))}
                <button onClick={addRoot} disabled={roots.length >= 4}>
                    Add Root
                </button>
            </div>
        </>
    );
}

export default App;
