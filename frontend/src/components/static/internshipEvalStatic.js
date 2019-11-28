import React from 'react';
import StudentForm from './student';
import CompanyForm from './company';
import SupervisorForm from './supervisor';
import InternshipForm from './internship';
import BuildEvaluation from '../buildEvaluation'
import { Typography } from '@material-ui/core'

export default class InternshipEvalStatic extends React.Component {

    componentDidMount() {}

    render() {
        return (
            <div style={{width: '50%', marginLeft: '25%'}}>
                <Typography variant="h3">
                    Internship Evaluation: {this.props.viewEvaluationState.evaluation.title} {this.props.viewEvaluationState.evaluation.year}
                </Typography>
                <Typography variant="h4">
                    Version {this.props.viewEvaluationState.evaluation.version}
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
