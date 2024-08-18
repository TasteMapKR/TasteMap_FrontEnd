import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Feedback = () => {
  const { id } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [myFeedback, setMyFeedback] = useState(null);
  const [newFeedback, setNewFeedback] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const token = localStorage.getItem('Access');
        const response = await axios.get(`http://localhost:8080/api/feedback/${id}`, {
          headers: { 'access': token },
        });
        setFeedbackData(response.data.data);
        setMyFeedback(response.data.data.myFeedbackResponseDTO);
        if (response.data.data.myFeedbackResponseDTO) {
          setNewFeedback(response.data.data.myFeedbackResponseDTO.content);
          setFeedbackStatus(response.data.data.myFeedbackResponseDTO.status);
        }
      } catch (error) {
        setError('Failed to fetch feedback data.');
        console.error('Failed to fetch feedback data:', error);
      }
    };

    fetchFeedbackData();
  }, [id]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('Access');
      const feedback = { content: newFeedback, status: feedbackStatus };

      await axios.post(`http://localhost:8080/api/feedback/${id}`, feedback, {
        headers: {
          'access': token,
          'Content-Type': 'application/json',
        },
      });

      setMyFeedback(feedback);
      setNewFeedback('');
      setIsEditing(false);
    } catch (error) {
      setError('Failed to submit feedback.');
      console.error('Failed to submit feedback:', error);
    }
  };

  const handleFeedbackEdit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('Access');
      const feedback = { content: newFeedback, status: feedbackStatus };

      await axios.put(`http://localhost:8080/api/feedback/${id}`, feedback, {
        headers: {
          'access': token,
          'Content-Type': 'application/json',
        },
      });

      setMyFeedback(feedback);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to edit feedback.');
      console.error('Failed to edit feedback:', error);
    }
  };

  const handleFeedbackDelete = async () => {
    try {
      const token = localStorage.getItem('Access');

      console.log('Deleting feedback with ID:', id); // 디버깅용
      const response = await axios.delete(`http://localhost:8080/api/feedback/${id}`, {
        headers: {
          'access': token,
        },
      });

      console.log('Delete response:', response); // 디버깅용

      if (response.status === 204) { // No Content
        setMyFeedback(null);
        setNewFeedback('');
        setFeedbackStatus(true);
      } else {
        setError('Unexpected response from server.');
      }
    } catch (error) {
      setError('Failed to delete feedback.');
      console.error('Failed to delete feedback:', error.response ? error.response.data : error.message);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h1>Feedback for Course {id}</h1>

      {myFeedback ? (
        <div className="my-feedback mt-4">
          <h3>내 피드백</h3>
          {isEditing ? (
            <div className="feedback-form mt-4">
              <h3>피드백 수정</h3>
              <form onSubmit={handleFeedbackEdit}>
                <div className="mb-3">
                  <label htmlFor="feedbackContent" className="form-label">피드백 내용</label>
                  <textarea
                    id="feedbackContent"
                    className="form-control"
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">상태</label>
                  <select
                    className="form-select"
                    value={feedbackStatus}
                    onChange={(e) => setFeedbackStatus(e.target.value === 'true')}
                  >
                    <option value="true">긍정적</option>
                    <option value="false">부정적</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">수정</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>취소</button>
              </form>
            </div>
          ) : (
            <div>
              <p>상태: {myFeedback.status ? '긍정적' : '부정적'}</p>
              <p>내용: {myFeedback.content}</p>
              <div className="mt-3">
                <button
                  className="btn btn-warning me-2"
                  onClick={() => setIsEditing(true)}
                >
                  수정
                </button>
                <button className="btn btn-danger" onClick={handleFeedbackDelete}>
                  삭제
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="feedback-form mt-4">
          <h3>피드백 작성</h3>
          <form onSubmit={handleFeedbackSubmit}>
            <div className="mb-3">
              <label htmlFor="feedbackContent" className="form-label">피드백 내용</label>
              <textarea
                id="feedbackContent"
                className="form-control"
                value={newFeedback}
                onChange={(e) => setNewFeedback(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">상태</label>
              <select
                className="form-select"
                value={feedbackStatus}
                onChange={(e) => setFeedbackStatus(e.target.value === 'true')}
              >
                <option value="true">긍정적</option>
                <option value="false">부정적</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">제출</button>
          </form>
        </div>
      )}

      <div className="feedback-list mt-5">
        <h3>다른 사용자의 피드백</h3>
        {feedbackData && feedbackData.feedbackResponseDTOs.content.length > 0 ? (
          feedbackData.feedbackResponseDTOs.content.map((feedback, index) => (
            <div key={index} className="feedback-item mt-3">
              <div className="d-flex align-items-center">
                {feedback.profile_image ? (
                  <img
                    src={feedback.profile_image}
                    alt={`${feedback.name}'s profile`}
                    className="profile-image me-3"
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                ) : (
                  <div className="profile-image me-3" style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ddd' }}></div>
                )}
                <div>
                  <p><strong>{feedback.name}</strong></p>
                  <p>상태: {feedback.status ? '긍정적' : '부정적'}</p>
                  <p>내용: {feedback.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>피드백이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
