import axios from 'axios';

export function getAnswersByQuestionId(questionID) {
    const url = 'http://localhost:5000/api/answer/get?question_id=' + questionID;
    return axios.get(url);
}

export function getAnswersByQuestionLabelAndEvalYear(type, label, start_year, end_year) {
    const url = 'http://localhost:5000/api/answer/get?type=' + type 
        + '&start_year=' + start_year + '&end_year=' + end_year + '&label=' + label;
    return axios.get(url);
}

export function getAnswersByQuestionEvalYear(type, start_year, end_year) {
    const url = 'http://localhost:5000/api/answer/get?type=' + type 
        + '&start_year=' + start_year + '&end_year=' + end_year;
    return axios.get(url);
}

export function answerEvaluation(payload){
    return axios.post('http://localhost:5000/api/answer/evaluation', payload)
}