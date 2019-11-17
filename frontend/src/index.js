import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:5000';
// axios.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true';


axios.interceptors.request.use(request => {	
	console.log(request);

	return request;
}, error => Promise.reject(error));

ReactDOM.render(<App />, document.getElementById('root'));

