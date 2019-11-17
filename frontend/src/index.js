import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
// axios.defaults.headers.common['Host'] = 'localhost:5000';

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'localhost:5000';
// axios.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true';
// axios.defaults.headers.common['Accept'] = 'true';
// axios.defaults.headers.common['Content-Type'] = 'true';
// axios.defaults.headers.common['X-Requested-With'] = 'true';
// axios.defaults.headers.common['Origin'] = 'true';

axios.interceptors.request.use(request => {	
	console.log(request);

	return request;
}, error => Promise.reject(error));

axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data
	console.log(response);
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
	// Do something with response error
    return Promise.reject(error);
  });

ReactDOM.render(<App />, document.getElementById('root'));

