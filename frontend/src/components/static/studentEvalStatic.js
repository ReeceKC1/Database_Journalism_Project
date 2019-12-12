import React from 'react';
import StudentForm from './student';
import CompanyForm from './company';
import SupervisorForm from './supervisor';
import InternshipForm from './internship';
import { Typography } from '@material-ui/core'
import BuildEvaluation from '../buildEvaluation'

export default class StudentEvalStatic extends React.Component {


    componentDidMount() {}

    render() {
        return (
            <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1">
                <Typography variant="h3">
                    Student Evaluation
                </Typography>                
                <StudentForm viewEvaluationState={this.props.viewEvaluationState}/>
                <CompanyForm viewEvaluationState={this.props.viewEvaluationState}/>
                <SupervisorForm viewEvaluationState={this.props.viewEvaluationState}/>
                <InternshipForm viewEvaluationState={this.props.viewEvaluationState}/>

                <BuildEvaluation viewEvaluationState={this.props.viewEvaluationState}/>


            </div>
        );
    }
}
