import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../page/create/Create.css'; // CSS 파일을 import

const categories = [
    { value: 'DESSERT', displayName: '디저트' },
    { value: 'MEAL', displayName: '식사' },
    { value: 'MIXED', displayName: '혼합' }
];

const Update = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { control, handleSubmit, register, setValue, setError, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            content: '',
            category: '',
            roots: [{ title: '', content: '', address: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'roots' });
    const [courseImage, setCourseImage] = useState(null);
    const [rootImages, setRootImages] = useState([]);
    const [places, setPlaces] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const accessToken = localStorage.getItem('Access');
                const response = await axios.get(`http://localhost:8080/api/course/${id}`, {
                    headers: { 'access': accessToken }
                });
                const { course, roots } = response.data.data;
                setValue('title', course.title);
                setValue('content', course.content);
                setValue('category', course.category);
                setValue('roots', roots);
                setRootImages(new Array(roots.length).fill(null));
            } catch (err) {
                console.error('데이터를 불러오는 데 실패했습니다.', err);
            }
        };

        fetchCourseData();
    }, [id, setValue]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=954c56e411af6cf22c15660906e30af8&libraries=services";
        script.async = true;
        script.onload = () => {
            const kakao = window.kakao;
            const placesInstance = new kakao.maps.services.Places();
            setPlaces(placesInstance);
        };
        document.body.appendChild(script);
    }, []);

    const searchAddress = (index) => {
        const address = prompt("주소를 입력해주세요.");
        if (address && places) {
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

    const onCourseImageChange = (e) => setCourseImage(e.target.files[0]);

    const onRootImageChange = (index) => (e) => {
        const file = e.target.files[0];
        setRootImages(prev => {
            const newImages = [...prev];
            newImages[index] = file;
            return newImages;
        });
    };

    const onSubmit = async (data) => {
        const formData = new FormData();

        if (courseImage) formData.append('courseImage', courseImage);
        formData.append('course', new Blob([JSON.stringify({
            title: data.title,
            content: data.content,
            category: data.category
        })], { type: 'application/json' }));

        formData.append('roots', new Blob([JSON.stringify(data.roots)], { type: 'application/json' }));

        rootImages.forEach((image, index) => {
            if (image) formData.append(`rootImages[${index}]`, image);
        });

        try {
            const accessToken = localStorage.getItem('Access');
            await axios.put(`http://localhost:8080/course/${id}`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'access': accessToken
                }
            });
            navigate(`/course/${id}`);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const validationErrors = error.response.data.errors;
                Object.keys(validationErrors).forEach(field => {
                    setError(field, { type: 'manual', message: validationErrors[field] });
                });
            } else {
                console.error('코스 업데이트 중 오류 발생:', error);
                alert('코스 업데이트에 실패했습니다.');
            }
        }
    };

    return (
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            {errors.global && <p className="error">{errors.global.message}</p>}
            <div>
                <label>코스 제목</label>
                <input type="text" {...register('title', { required: "코스 제목은 필수 항목입니다." })} />
                {errors.title && <p className="error">{errors.title.message}</p>}
            </div>
            <div>
                <label>코스 내용</label>
                <textarea {...register('content', { required: "코스 내용은 필수 항목입니다." })} />
                {errors.content && <p className="error">{errors.content.message}</p>}
            </div>
            <div>
                <label>카테고리</label>
                <select {...register('category', { required: "카테고리는 필수 항목입니다." })}>
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
                                <input type="text" {...field} />
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
                                <input type="text" {...field} readOnly />
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

            <button type="submit">업데이트</button>
        </form>
    );
};

export default Update;
