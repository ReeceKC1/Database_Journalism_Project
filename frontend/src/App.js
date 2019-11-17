import React from 'react';
import axios from 'axios';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    axios.get('localhost:5000').then((response) => {
      console.log(response);
      
    }).catch((error) => console.log('here',error));
  }


  render() {
    return (
      <div className="container padded">
        PP POOPOO
      </div>
    );
  }
  
}

