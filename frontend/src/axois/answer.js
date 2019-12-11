import axios from 'axios';

export function getAnswersByQuestionId(questionID) {
    const url = 'http://localhost:5000/api/answer/get?question_id=' + questionID;
    return axios.get(url);
}

export function getAnswersByQuestionLabelAndEvalYear(type, label, start_year, end_year) {
    const url = 'http://localhost:5000/api/answer/get?type=' + type 
        + '&start_year=' + start_year + '&end_year=' + end_year + '&q_label=' + label;
    return axios.get(url);
}
