import axios from 'axios';

export function getStudentData(id){
    return axios.get(`http://localhost:5000/api/student/check/${id}`)
}

export function getAnswersByStudent(id){
    return axios.get(`http://localhost:5000/api/answer/get?student_id=${id}`)
}

export function getEvaluationByAnswers(type, year){
    return axios.get(`http://localhost:5000/api/evaluation/get?type=${type}&year=${year}`)
}

export function checkSupervisor(email){
    let url = 'http://localhost:5000/api/supervisor/check/' + email;
    return axios.get(url);
}

export function getInternship(student_id,company_name,start_date){
    let url = 'http://localhost:5000/api/internship/get?student_id=' + student_id + '&company_name=' + company_name + '&start_date=' + start_date;
    return axios.get(url);
}

export function getCompany(name){
    let url = 'http://localhost:5000/api/company/check/' + name;
    return axios.get(url);
}