import React from 'react';

const FeedbackList = ({ feedbackData }) => {
  if (!feedbackData || feedbackData.feedbackResponseDTOs.content.length === 0) {
    return <p>피드백이 없습니다.</p>;
  }

  return (
    <div className="feedback-list mt-5">
      <h3>다른 사용자의 피드백</h3>
      {feedbackData.feedbackResponseDTOs.content.map((feedback, index) => (
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
      ))}
    </div>
  );
};

export default FeedbackList;
