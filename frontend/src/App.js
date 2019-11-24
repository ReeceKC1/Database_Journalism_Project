import React from 'react';
import axios from 'axios';
import { observable, decorate } from '../node_modules/mobx/lib/mobx'
import { observer, } from '../node_modules/mobx-react/dist/mobx-react'
import { globalState } from './state'
import ReactDOM from 'react-dom';
import {Switch, Route} from 'react-router-dom';
import Header from './components/header';
import CreateEvaluation from './pages/create_evaluation';
import Home from './pages/home';

const App  = observer(class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    axios.get('http://localhost:5000/').then(response => {
      console.log(response);
    }).catch(error => console.log('here',error));
  }


  render() {
    return (
      <div>
        {/* Headers */}
        <Header></Header>

        {/* Main Body Routes */}
        <Switch>
          <Route path="/create">
            <CreateEvaluation />

          </Route>


          {/* Must BE LAST it matches with all routes */}
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
     
    );
  }
  
})

decorate(App, {
  taco: observable,
})

export default App

