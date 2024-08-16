import React, { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categories = [
    { value: 'DESSERT', displayName: '디저트' },
    { value: 'MEAL', displayName: '식사' },
    { value: 'MIXED', displayName: '혼합' }
];

const Create = () => {
    const { control, handleSubmit, register, reset, formState: { errors } } = useForm({
        defaultValues: {
            roots: [{ title: '', content: '', address: '' }]
        }
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'roots' });
    const [courseImage, setCourseImage] = useState(null);
    const [rootImages, setRootImages] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const navigate = useNavigate();

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
        // 폼 제출 시 메시지 초기화
        setMessage({ text: '', type: '' });

        // 필수 이미지 확인
        if (!courseImage) {
            setMessage({ text: '코스 이미지는 필수입니다.', type: 'error' });
            return;
        }

        // 루트 이미지 확인
        if (data.roots.length !== rootImages.length || rootImages.includes(null)) {
            setMessage({ text: '모든 루트에 이미지를 추가해주세요.', type: 'error' });
            return;
        }

        const formData = new FormData();

        // 코스 이미지 추가
        formData.append('courseImage', courseImage);

        // 코스 데이터 추가 (JSON 문자열로)
        formData.append('course', new Blob([JSON.stringify({
            title: data.title,
            content: data.content,
            category: data.category
        })], { type: "application/json" }));

        // 루트 데이터 추가 (JSON 문자열로)
        formData.append('roots', new Blob([JSON.stringify(data.roots)], { type: "application/json" }));

        // 루트 이미지 추가
        rootImages.forEach((image, index) => {
            if (image) {
                formData.append(`rootImages[${index}]`, image);
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

            // 폼 초기화
            reset();
            setCourseImage(null);
            setRootImages([]);

            setTimeout(() => {
                navigate('/'); // 성공 후 리디렉션
            }, 2000); // 2초 후 리디렉션
        } catch (error) {
            console.error('코스 생성 중 오류 발생:', error);
            setMessage({ text: '코스 생성에 실패했습니다.', type: 'error' });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {message.text && (
                <p style={{ color: message.type === 'error' ? 'red' : 'green' }}>
                    {message.text}
                </p>
            )}
            <div>
                <label>코스 제목</label>
                <input {...register('title', { required: "코스 제목은 필수입니다." })} />
                {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
            </div>
            <div>
                <label>코스 내용</label>
                <textarea {...register('content', { required: "코스 내용은 필수입니다." })} />
                {errors.content && <p style={{ color: 'red' }}>{errors.content.message}</p>}
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
                {errors.category && <p style={{ color: 'red' }}>{errors.category.message}</p>}
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
                                {errors.roots?.[index]?.title && <p style={{ color: 'red' }}>{errors.roots[index].title.message}</p>}
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
                                {errors.roots?.[index]?.content && <p style={{ color: 'red' }}>{errors.roots[index].content.message}</p>}
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
                                {errors.roots?.[index]?.address && <p style={{ color: 'red' }}>{errors.roots[index].address.message}</p>}
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
    );
};

export default Create;
