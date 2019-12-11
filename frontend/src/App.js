import React from 'react';
import { observable, decorate } from '../node_modules/mobx/lib/mobx'
import { observer, } from '../node_modules/mobx-react/dist/mobx-react'
import {Switch, Route} from 'react-router-dom';
import Header from './components/header';
import CreateEvaluation from './pages/create_evaluation';
import Home from './pages/home';
import ViewEvaluation from './pages/view_evaluation';
import EvaluationAnalysis from './pages/evaluation-analysis';
import StudentData from './pages/studentData';
import LabelAnalysis from './pages/label_analysis';

const App = observer(class App extends React.Component {
  render() {
    return (
      <div>
        {/* Headers */}
        <Header/>

        {/* Main Body Routes */}
        <Switch>
          <Route path="/create" exact render = {(props) => <CreateEvaluation {...props}/>}/>

          <Route path="/view-evaluation" exact render = {(props) => <ViewEvaluation {...props}/>}/>

          <Route path="/take-evaluation" exact render = {(props) => <ViewEvaluation {...props}/>}/>

          <Route path="/evaluation-analysis" exact render = {(props) => <EvaluationAnalysis {...props}/>}/>

          <Route path="/student-info" exact render = {(props) => <StudentData {...props}/>}/>

          <Route path="/label-analysis" exact render = {(props) => <LabelAnalysis {...props}/>}/>
          
          {/* Must BE LAST it matches with all routes */}
          <Route path="/" exact render = {(props) => <Home {...props}/>}/>
        </Switch>
      </div>
     
    );
  }
  
})

decorate(App, {
  taco: observable,
})

export default App
