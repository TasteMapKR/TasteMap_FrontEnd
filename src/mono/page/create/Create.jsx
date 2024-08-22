import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Create.css'; 

const categories = [
    { value: 'DESSERT', displayName: '디저트' },
    { value: 'MEAL', displayName: '식사' },
    { value: 'MIXED', displayName: '혼합' }
];

const Create = () => {
    const { control, handleSubmit, register, reset, formState: { errors }, setValue } = useForm({
        defaultValues: {
            roots: [{ title: '', content: '', address: '' }]
        }
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'roots' });
    const [courseImage, setCourseImage] = useState(null);
    const [rootImages, setRootImages] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=954c56e411af6cf22c15660906e30af8&libraries=services";
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.kakao && window.kakao.maps.services) {
                console.log('카카오 맵 API가 성공적으로 로드되었습니다.');
            } else {
                console.error('카카오 맵 API 로드 실패');
            }
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const searchAddress = (index) => {
        if (!window.kakao || !window.kakao.maps.services) {
            alert('카카오 맵 API가 로드되지 않았습니다.');
            return;
        }

        const address = prompt("주소를 입력해주세요.");
        if (address) {
            const places = new window.kakao.maps.services.Places();

            places.keywordSearch(address, (data, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const firstResult = data[0];
                    setValue(`roots[${index}].address`, firstResult.address_name);
                } else {
                    alert("주소를 찾을 수 없습니다.");
                }
            });
        }
    };

    const onCourseImageChange = (e) => {
        setCourseImage(e.target.files[0]);
    };

    const onRootImageChange = (index) => (e) => {
        const file = e.target.files[0];
        setRootImages(prev => {
            const newImages = [...prev];
            newImages[index] = file;
            return newImages;
        });
    };

    const onSubmit = async (data) => {
        setMessage({ text: '', type: '' });

        if (!courseImage) {
            setMessage({ text: '코스 이미지는 필수입니다.', type: 'error' });
            return;
        }

        if (data.roots.length !== rootImages.length || rootImages.includes(null)) {
            setMessage({ text: '모든 루트에 이미지를 추가해주세요.', type: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('course', new Blob([JSON.stringify({
            title: data.title,
            content: data.content,
            category: data.category
        })], { type: "application/json" }));
        formData.append('courseImage', courseImage);
        formData.append('roots', new Blob([JSON.stringify(data.roots)], { type: "application/json" }));

        rootImages.forEach((image) => {
            if (image) {
                formData.append('rootImages', image);
            }
        });

        try {
            const accessToken = localStorage.getItem('Access');
            await axios.post('http://localhost:8080/course', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'access': accessToken
                }
            });
            setMessage({ text: '코스가 성공적으로 생성되었습니다!', type: 'success' });
            reset();
            setCourseImage(null);
            setRootImages([]);
            setTimeout(() => {
                navigate('/'); 
            }, 2000); 
        } catch (error) {
            console.error('코스 생성 중 오류 발생:', error);
            setMessage({ text: '코스 생성에 실패했습니다.', type: 'error' });
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
                {message.text && (
                    <div className={`message ${message.type}`}>
                        {message.text}
                    </div>
                )}
                <div>
                    <label>코스 제목</label>
                    <input {...register('title', { required: "코스 제목은 필수입니다." })} />
                    {errors.title && <p className="error">{errors.title.message}</p>}
                </div>
                <div>
                    <label>코스 내용</label>
                    <textarea {...register('content', { required: "코스 내용은 필수입니다." })} />
                    {errors.content && <p className="error">{errors.content.message}</p>}
                </div>
                <div>
                    <label>카테고리</label>
                    <select {...register('category', { required: "카테고리는 필수입니다." })}>
                        <option value="">카테고리 선택</option>
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.displayName}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="error">{errors.category.message}</p>}
                </div>
                <div>
                    <label>코스 이미지</label>
                    <input type="file" onChange={onCourseImageChange} />
                </div>

                <h3>루트</h3>
                {fields.map((item, index) => (
                    <div key={item.id}>
                        <Controller
                            control={control}
                            name={`roots[${index}].title`}
                            defaultValue={item.title || ''}
                            render={({ field }) => (
                                <div>
                                    <label>루트 제목</label>
                                    <input {...field} />
                                    {errors.roots?.[index]?.title && <p className="error">{errors.roots[index].title.message}</p>}
                                </div>
                            )}
                        />
                        <Controller
                            control={control}
                            name={`roots[${index}].content`}
                            defaultValue={item.content || ''}
                            render={({ field }) => (
                                <div>
                                    <label>루트 내용</label>
                                    <textarea {...field} />
                                    {errors.roots?.[index]?.content && <p className="error">{errors.roots[index].content.message}</p>}
                                </div>
                            )}
                        />
                        <Controller
                            control={control}
                            name={`roots[${index}].address`}
                            defaultValue={item.address || ''}
                            render={({ field }) => (
                                <div>
                                    <label>루트 주소</label>
                                    <input {...field} />
                                    <button type="button" onClick={() => searchAddress(index)}>주소 검색</button>
                                    {errors.roots?.[index]?.address && <p className="error">{errors.roots[index].address.message}</p>}
                                </div>
                            )}
                        />
                        <div>
                            <label>루트 이미지</label>
                            <input type="file" onChange={onRootImageChange(index)} />
                        </div>
                        <button type="button" onClick={() => remove(index)}>루트 삭제</button>
                    </div>
                ))}
                <button type="button" onClick={() => append({ title: '', content: '', address: '' })} disabled={fields.length >= 4}>
                    루트 추가
                </button>

                <button type="submit">제출</button>
            </form>
        </div>
    );
};

export default Create;
