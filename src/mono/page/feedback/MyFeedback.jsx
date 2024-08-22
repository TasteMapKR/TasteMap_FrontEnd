import React from 'react';
import FeedbackForm from './FeedbackForm';

const MyFeedback = ({ myFeedback, isEditing, setIsEditing, handleFeedbackDelete, id, fetchFeedbackData }) => {
  if (isEditing) {
    return <FeedbackForm id={id} fetchFeedbackData={fetchFeedbackData} myFeedback={myFeedback} setIsEditing={setIsEditing} />;
  }

  return (
    <div className="my-feedback mt-4">
      <h3>내 피드백</h3>
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
  );
};

export default MyFeedback;
