import React from 'react';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    axios.get('localhost:5000/', {
      headers: { 
        "Access-Control-Allow-Origin": "*"
      },
    responseType: 'json',
     }).then(response => {
      console.log(response);
    }).catch(error => console.log('here',error));

    // axios.get('').then((response) => {
    //   console.log(response);
      
    // }).catch((error) => console.log('here',error));
  }


  render() {
    return (
      <div className="container padded">
        PP POOPOO
      </div>
    );
  }
  
}

