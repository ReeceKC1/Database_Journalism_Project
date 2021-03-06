import React from 'react';
import StudentForm from './student';
import ReviewerForm from './reviewerForm'
import { Typography } from '@material-ui/core'
import BuildEvaluation from '../buildEvaluation'

export default class PortfolioEvalStatic extends React.Component {

    componentDidMount() {}

    render() {
        return (
            <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1">
                <Typography variant="h3">
                    Portfolio Evaluation
                </Typography>
                <StudentForm viewEvaluationState={this.props.viewEvaluationState}/>
                <ReviewerForm viewEvaluationState={this.props.viewEvaluationState}/>

                <BuildEvaluation viewEvaluationState={this.props.viewEvaluationState}/>

            </div>
        );
    }
}
