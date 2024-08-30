import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

// 카테고리별 코스 가져오기
export const fetchCoursesByCategory = async (category, page) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/course/category`, {
            params: {
                category: category,
                page: page - 1,
                size: 4
            }
        });

        return response.data.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};
export const fetchCourseData = async (id, accessToken) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/course/${id}`, {
            headers: { 'access': accessToken }
        });
        return response.data.data;
    } catch (error) {
        throw new Error('Failed to fetch course data: ' + (error.response ? error.response.data : error.message));
    }
};

export const createCourse = async (formData, accessToken) => {
    try {
        return await axios.post('http://localhost:8080/course', formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'access': accessToken
            }
        });
    } catch (error) {
        throw new Error('코스 생성에 실패했습니다.');
    }
};
// 전체 코스 가져오기
export const fetchAllCourses = async (page) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/course`, {
            params: {
                page: page - 1,
                size: 4
            }
        });

        return response.data.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
};
export const fetchFeedbackData = async (id, token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/feedback/${id}`, {
        headers: { access: token },
      });
      return response.data.data;
    } catch (error) {
      throw new Error('피드백 데이터를 가져오는 데 실패했습니다.');
    }
  };
  
  export const deleteFeedback = async (id, token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/feedback/${id}`, {
        headers: { access: token },
      });
      return response.status;
    } catch (error) {
      throw new Error('피드백 삭제에 실패했습니다.');
    }
  };

  export const fetchAccessToken = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/refresh`, {}, {
            withCredentials: true
        });

        const newAccessToken = response.headers['access'];
        const { name, profile } = response.data;

        return { newAccessToken, name, profile };
    } catch (error) {
        throw new Error('Error reissuing Access token: ' + (error.response ? error.response.data : error.message));
    }
};
export const updateCourse = async (id, formData, accessToken) => {
    try {
        await axios.put(`${API_BASE_URL}/api/course/${id}`, formData, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'access': accessToken
            }
        });
    } catch (error) {
        throw new Error('Failed to update course: ' + (error.response ? error.response.data : error.message));
    }
};