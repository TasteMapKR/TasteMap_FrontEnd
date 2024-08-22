import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PieChart from '../../component/PieChart';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';
import MyFeedback from './MyFeedback';
import './Feedback.css';

const Feedback = () => {
  const { id } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [myFeedback, setMyFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('Access');

  const fetchFeedbackData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/feedback/${id}`, {
        headers: { access: token },
      });
      setFeedbackData(response.data.data);
      setMyFeedback(response.data.data.myFeedbackResponseDTO);
    } catch (error) {
      setError('피드백 데이터를 가져오는 데 실패했습니다.');
      console.error('피드백 데이터를 가져오는 데 실패했습니다:', error);
    }
  };

  const handleFeedbackDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:8080/feedback/${id}`, {
        headers: { access: token },
      });

      if (response.status === 204) {
        fetchFeedbackData();
      } else {
        setError('서버로부터의 응답이 예상과 다릅니다.');
      }
    } catch (error) {
      setError('피드백 삭제에 실패했습니다.');
      console.error('피드백 삭제에 실패했습니다:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, [id]);

  return (
    <div className="feedback-container container mt-5">
      <h1>피드백</h1>
      {error && <p className="text-danger">{error}</p>}

      <PieChart feedbackData={feedbackData} />

      {token ? (
        myFeedback ? (
          <MyFeedback
            myFeedback={myFeedback}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleFeedbackDelete={handleFeedbackDelete}
            id={id}
            fetchFeedbackData={fetchFeedbackData}
          />
        ) : (
          <FeedbackForm id={id} fetchFeedbackData={fetchFeedbackData} />
        )
      ) : (
        <p>피드백을 작성하려면 로그인이 필요합니다.</p>
      )}

      <FeedbackList feedbackData={feedbackData} />
    </div>
  );
};

export default Feedback;
