import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Feedback.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Feedback = () => {
  const { id } = useParams();
  const [feedbackData, setFeedbackData] = useState(null);
  const [myFeedback, setMyFeedback] = useState(null);
  const [newFeedback, setNewFeedback] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch feedback data function
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
      setError('피드백 데이터를 가져오는 데 실패했습니다.');
      console.error('피드백 데이터를 가져오는 데 실패했습니다:', error);
    }
  };

  useEffect(() => {
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

      // Refresh data after submission
      fetchFeedbackData();
    } catch (error) {
      setError('피드백 제출에 실패했습니다.');
      console.error('피드백 제출에 실패했습니다:', error);
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

      // Refresh data after editing
      fetchFeedbackData();
    } catch (error) {
      setError('피드백 수정에 실패했습니다.');
      console.error('피드백 수정에 실패했습니다:', error);
    }
  };

  const handleFeedbackDelete = async () => {
    try {
      const token = localStorage.getItem('Access');

      const response = await axios.delete(`http://localhost:8080/api/feedback/${id}`, {
        headers: {
          'access': token,
        },
      });

      if (response.status === 204) { // No Content
        // Refresh data after deletion
        fetchFeedbackData();
      } else {
        setError('서버로부터의 응답이 예상과 다릅니다.');
      }
    } catch (error) {
      setError('피드백 삭제에 실패했습니다.');
      console.error('피드백 삭제에 실패했습니다:', error.response ? error.response.data : error.message);
    }
  };

  const renderPieChart = () => {
    if (!feedbackData || (feedbackData.positive === 0 && feedbackData.negative === 0)) {
      return <p>피드백이 없습니다.</p>;
    }

    const data = {
      labels: ['긍정적', '부정적'],
      datasets: [
        {
          label: '피드백',
          data: [feedbackData.positive, feedbackData.negative],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.label + ': ' + tooltipItem.raw;
            },
          },
        },
      },
    };

    return (
      <div className="pie-chart-stats-container">
        <div className="pie-chart-box">
          <h3>피드백 비율</h3>
          <div className="pie-chart">
            <Pie data={data} options={options} />
          </div>
        </div>
        <div className="feedback-stats">
          <h4>피드백 통계</h4>
          <p className="positive">긍정적: {feedbackData.positive}</p>
          <p className="negative">부정적: {feedbackData.negative}</p>
        </div>
      </div>
    );
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      {renderPieChart()}
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
                    alt={`${feedback.name}의 프로필`}
                    className="profile-image me-3"
                  />
                ) : (
                  <div className="profile-image me-3"></div>
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
