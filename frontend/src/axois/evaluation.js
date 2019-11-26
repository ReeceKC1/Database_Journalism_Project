import axios from 'axios';

export function getEvaluationByKey(type, year) {
    const url = 'http://localhost:5000/api/evaluation/get?type='+ type + '&year=' + year;
    return axios.get(url);
}