import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css'; // 일반 CSS 파일 임포트

const categories = [
    { value: 'DESSERT', displayName: '디저트' },
    { value: 'MEAL', displayName: '식사' },
    { value: 'MIXED', displayName: '혼합' }
];

const getCategoryDisplayName = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.displayName : categoryValue;
};

const CourseCard = ({ course }) => {
    return (
        <Link to={`/course/${course.id}`} className="card-link">
            <div className="card">
                <div className="main-image-container">
                    <img 
                        src={`https://quddaztestbucket.s3.ap-northeast-2.amazonaws.com/course/${course.id}`} 
                        alt={course.title} 
                        className="main-image" 
                    />
                    <hr className="image-divider" />
                </div>
                <div className="content">
                    <h2 className="title">{course.title}</h2>
                    <p className="category">#{getCategoryDisplayName(course.category)}</p>
                    <p className="description">{course.description}</p>
                    <div className="profile-container">
                        {course.profile_image && (
                            <img src={course.profile_image} alt={course.name} className="profile-image" />
                        )}
                        <p className="name">{course.name}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;
