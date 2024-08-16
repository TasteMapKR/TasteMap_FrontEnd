import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

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
        <Link to={`/course/${course.id}`} style={styles.cardLink}>
            <div style={styles.card}>
                <div style={styles.mainImageContainer}>
                    <img 
                        src={`https://quddaztestbucket.s3.ap-northeast-2.amazonaws.com/course/${course.id}`} 
                        alt={course.title} 
                        style={styles.mainImage} 
                    />
                    <hr style={styles.imageDivider} />
                </div>
                <div style={styles.content}>
                    <h2 style={styles.title}>{course.title}</h2>
                    <p style={styles.category}>#{getCategoryDisplayName(course.category)}</p>
                    <p style={styles.description}>{course.description}</p>
                    <div style={styles.profileContainer}>
                        {course.profile_image && (
                            <img src={course.profile_image} alt={course.name} style={styles.profileImage} />
                        )}
                        <p style={styles.name}>{course.name}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

const styles = {
    cardLink: {
        textDecoration: 'none',  // Remove underline from link
        color: 'inherit',        // Inherit color from parent element
    },
    card: {
        border: '2px solid #D6C9FF',  // Light purple border
        borderRadius: '12px',
        padding: '16px',
        margin: '16px',
        maxWidth: '300px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#FFFFFF',  // White background
    },
    mainImageContainer: {
        position: 'relative',
        width: '250px',  // Fixed width for the image container
        height: '150px',  // Fixed height for the image container
        overflow: 'hidden',
        borderRadius: '12px',
        marginBottom: '12px',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',  // Ensures the image covers the container
    },
    imageDivider: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        borderTop: '2px solid #D6C9FF',  // Light purple line
        margin: '0',
    },
    content: {
        textAlign: 'left',
    },
    title: {
        fontSize: '18px',
        margin: '8px 0',
        fontWeight: 'bold',
    },
    category: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '8px',
    },
    description: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '12px',
    },
    profileContainer: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '8px',
    },
    profileImage: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        marginRight: '8px',
    },
    name: {
        fontSize: '16px',
        margin: '0',
    }
};

export default CourseCard;
