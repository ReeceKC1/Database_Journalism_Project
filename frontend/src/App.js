import React from 'react';
import axios from 'axios';
import { observable, decorate } from '../node_modules/mobx/lib/mobx'
import { observer, } from '../node_modules/mobx-react/dist/mobx-react'
import { globalState } from './state'

const App  = observer(class App extends React.Component {
  taco = []
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/', {
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
        {globalState.appState.tacoGlobal &&
        <div>
          hello
        </div>
      }
      </div>
    );
  }
  
})

decorate(App, {
  taco: observable,
})

export default App

