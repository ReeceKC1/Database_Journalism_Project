import React from 'react';
import StudentForm from './student';
import ReviewerForm from './ReviewerForm'
import { Typography } from '@material-ui/core'
import BuildEvaluation from '../buildEvaluation'

export default class PortfolioEvalStatic extends React.Component {

    componentDidMount() {}

    render() {
        return (
            <div style={{width: '50%', marginLeft: '25%'}}>
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
