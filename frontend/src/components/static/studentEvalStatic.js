import React from 'react';
// import { Container, Table, TableHead, TableRow, TableCell, TableBody,
//     Button } from '@material-ui/core/';
// import {NavLink, Link} from 'react-router-dom';
import StudentForm from './student';
import CompanyForm from './company';
import SupervisorForm from './supervisor';
import InternshipForm from './internship';

export default class StudentEvalStatic extends React.Component {
    constructor(props) {
        super(props);

        
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                This is the student Eval / on-site Eval static form section
                <StudentForm viewEvaluationState={this.props.viewEvaluationState}/>
                <CompanyForm viewEvaluationState={this.props.viewEvaluationState}/>
                <SupervisorForm viewEvaluationState={this.props.viewEvaluationState}/>
                <InternshipForm viewEvaluationState={this.props.viewEvaluationState}/>

                <br></br>
                This is where we will load in the lower form

            </div>
        );
    }
}
