import React from 'react';
// import { Container, Table, TableHead, TableRow, TableCell, TableBody,
//     Button } from '@material-ui/core/';
// import {NavLink, Link} from 'react-router-dom';
import StudentForm from './student';
import ReviewerForm from './ReviewerForm'

export default class PortfolioEvalStatic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                This is the portfolio eval static form section
                <StudentForm viewEvaluationState={this.props.viewEvaluationState}/>
                <ReviewerForm viewEvaluationState={this.props.viewEvaluationState}/>
                <br></br>
                This is where we will load in the lower form

            </div>
        );
    }
}
