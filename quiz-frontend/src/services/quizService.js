import api from './api';

export const fetchTeacherQuizzes = async () => {
  const res = await api.get('/quizzes/get-quizzes');
  return res.data;
};

export const fetchQuizSubmissions = async (quizId) => {
  const res = await api.get(`/submissions/get-submissions/${quizId}`);
  return res.data;
};

export const createQuizTeacher = async (quizData) => {
  const res = await api.post('/quizzes/create-quiz', quizData);
  return res.data;
};

export const fetchQuizById = async (id) => {
  const res = await api.get(`/questions/get-questions/${id}`);
  return { questions: res.data };
};

export const getQuizResults = async (quizId) => {
  const res = await api.get(`/quizzes/${quizId}/results`);
  return res.data;
};

export const fetchStudentQuizzes = async () => {
  const res = await api.get('/quizzes/get-quizzes-for-student');
  return res.data;
};

export const fetchStudentQuiz = async (quizId) => {
  const res = await api.get(`/quizzes/get-quiz/${quizId}`);
  return res.data;
};

export const submitStudentQuiz = async (quizId, answers) => {
  const res = await api.post('/create-submission', { quiz_id: quizId, answers });
  return res.data;
}; 