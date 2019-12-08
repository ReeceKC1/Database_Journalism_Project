import axios from 'axios';

export function getAnswersByQuestionId(questionID) {
    const url = 'http://localhost:5000/api/answer/get?question_id=' + questionID;
    return axios.get(url);
}
