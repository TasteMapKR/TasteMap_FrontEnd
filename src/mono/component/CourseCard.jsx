// CourseCard.js
import React from 'react';

const CourseCard = ({ course }) => {
    return (
        <div style={styles.card}>
            {course.profile_image && (
                <img src={course.profile_image} alt={course.title} style={styles.image} />
            )}
            <div style={styles.content}>
                <h2 style={styles.title}>{course.title}</h2>
                <p style={styles.category}>Category: {course.category}</p>
                <p style={styles.name}>Name: {course.name}</p>
            </div>
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '16px',
        maxWidth: '300px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
    },
    content: {
        textAlign: 'center',
    },
    title: {
        fontSize: '18px',
        margin: '8px 0',
    },
    category: {
        fontSize: '14px',
        color: '#666',
    },
    name: {
        fontSize: '16px',
        margin: '8px 0',
    }
};

export default CourseCard;
