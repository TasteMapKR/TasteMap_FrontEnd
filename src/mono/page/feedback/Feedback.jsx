import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PieChart from '../../component/PieChart';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';
import MyFeedback from './MyFeedback';
import { fetchFeedbackData, deleteFeedback } from '../../api/api'; // api.js에서 가져오기
import './Feedback.css';

const Feedback = () => {
  const { id } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [myFeedback, setMyFeedback] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('Access');

  const handleFetchFeedbackData = async () => {
    try {
      const data = await fetchFeedbackData(id, token);
      setFeedbackData(data);
      setMyFeedback(data.myFeedbackResponseDTO);
    } catch (error) {
      setError(error.message);
      console.error('피드백 데이터를 가져오는 데 실패했습니다:', error);
    }
  };

  const handleFeedbackDelete = async () => {
    try {
      const status = await deleteFeedback(id, token);

      if (status === 204) {
        handleFetchFeedbackData();
      } else {
        setError('서버로부터의 응답이 예상과 다릅니다.');
      }
    } catch (error) {
      setError(error.message);
      console.error('피드백 삭제에 실패했습니다:', error);
    }
  };

  useEffect(() => {
    handleFetchFeedbackData();
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
            fetchFeedbackData={handleFetchFeedbackData}
          />
        ) : (
          <FeedbackForm id={id} fetchFeedbackData={handleFetchFeedbackData} />
        )
      ) : (
        <p>피드백을 작성하려면 로그인이 필요합니다.</p>
      )}

      <FeedbackList feedbackData={feedbackData} />
    </div>
  );
};

export default Feedback;
