import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ id, fetchFeedbackData, myFeedback, setIsEditing }) => {
  const [newFeedback, setNewFeedback] = useState(myFeedback ? myFeedback.content : '');
  const [feedbackStatus, setFeedbackStatus] = useState(myFeedback ? myFeedback.status : true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('Access');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const feedback = { content: newFeedback, status: feedbackStatus };
      const url = myFeedback
        ? `http://localhost:8080/feedback/${id}`
        : `http://localhost:8080/feedback/${id}`;
      const method = myFeedback ? 'put' : 'post';

      await axios({
        method,
        url,
        data: feedback,
        headers: {
          'access': token,
          'Content-Type': 'application/json',
        },
      });

      fetchFeedbackData();
      if (setIsEditing) setIsEditing(false); // Exit edit mode
    } catch (error) {
      setError(myFeedback ? '피드백 수정에 실패했습니다.' : '피드백 제출에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="feedback-form mt-4">
      <h3>{myFeedback ? '피드백 수정' : '피드백 작성'}</h3>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="btn btn-primary">
          {myFeedback ? '수정' : '제출'}
        </button>
        {myFeedback && (
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>
            취소
          </button>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm;
