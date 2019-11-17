import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import { HashRouter } from 'react-router-dom';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


axios.interceptors.request.use(request => {	
	console.log(request);

	return request;
}, error => Promise.reject(error));

ReactDOM.render(
	<HashRouter>
    	<App />
  	</HashRouter>
	, document.getElementById('root'));

