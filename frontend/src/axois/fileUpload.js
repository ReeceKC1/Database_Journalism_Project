import axios from 'axios';

export function postFile(payload){
    return axios.post('http://localhost:5000/api/file-upload', payload)
}