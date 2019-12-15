import axios from 'axios';

export function getAllEvaluations() {
    return axios.get('http://localhost:5000/api/evaluation/get')
}

export function getEvaluationByKey(type, year) {
    const url = 'http://localhost:5000/api/evaluation/get?type='+ type + '&year=' + year;
    return axios.get(url);
}

export function getEvaluationsByType(type) {
    const url = 'http://localhost:5000/api/evaluation/get?type=' + type;
    return axios.get(url);
}

export function createEvaluation(payload){
    return axios.post('http://localhost:5000/api/evaluation/create', payload)
}