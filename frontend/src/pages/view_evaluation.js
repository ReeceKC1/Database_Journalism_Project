import React from 'react';
import { Container } from '@material-ui/core/';
import StudentEvalStatic from '../components/static/studentEvalStatic';
import InternshipEvalStatic from '../components/static/internshipEvalStatic';
import PortfolioEvalStatic from '../components/static/portfolioEvalStatic';
import * as Evaluation from '../axois/evaluation';
import { observable, decorate } from '../../node_modules/mobx/lib/mobx'
import { observer } from '../../node_modules/mobx-react/dist/mobx-react'

const ViewEvaluation = observer(class ViewEvaluation extends React.Component {
    constructor(props) {
        super(props);

        const viewEvaluationState = {
            readOnly: {
                readOnly: false,
            },
            reviewer_state: {
                reviewer_name: '',
            },
            student_state: {
                already_exists: false,
                student_id: '',
                first_name: '',
                last_name: '',
                email: '',
                class_year: '',
                semester_of_completion: '',
                grade: '',
                pr_major_minor: '',
            },
            internship_state: {
                start_date: '',
                end_date: '',
                hours: '',
            },
            company_state: {
                company_name: '',
                address: '',
                phone: '',
            },
            supervisor_state: {
                email: '',
                name: '',
                title: '',
            }
        }

        decorate(viewEvaluationState, {
            readOnly: observable,
            reviewer_state: observable,
            student_state: observable,
            internship_state: observable,
            company_state: observable,
            supervisor_state: observable,
        })

        this.state = {
            viewEvaluationState: viewEvaluationState,
            evaluation: null,
            type: null,
            year: null,
        };
    }

    // Make the call based on params
    componentDidMount() {
        if(this.props.location !== undefined) {
            let search = this.props.location.search
            var typePatt = "=(.+)&";
            var yearPatt = "year=(.+)"

            // Got Type and year from the url
            var type = search.match(typePatt)[1];
            var year = search.match(yearPatt)[1];
            // Setting it to the state
            this.setState({ type: type, year: year});
            
            Evaluation.getEvaluationByKey(type, year).then(response => {
                let data = response.data;
                console.log('Got Eval', response);

                this.setState({evaluation: data});
            }).catch(error => {
                console.log(error);
            });
        }
    }

    render() {
        if(this.state.evaluation != null) {
            return (
                <Container maxWidth="md" minwidth="sm">
                    {JSON.stringify(this.state.evaluation)}
                    <br></br>
                    <br></br>

                    {/* Rendering the header */}
                    {this.state.type === 'student_eval' && 
                        <StudentEvalStatic viewEvaluationState={this.state.viewEvaluationState}/>
                    }

                    {this.state.type === 'student_onsite_eval' && 
                        <StudentEvalStatic viewEvaluationState={this.state.viewEvaluationState}/>
                    }

                    {this.state.type === 'internship_eval' && 
                        <InternshipEvalStatic viewEvaluationState={this.state.viewEvaluationState}/>
                    }
                    
                    {this.state.type === 'portfolio_eval' && 
                        <PortfolioEvalStatic viewEvaluationState={this.state.viewEvaluationState}/>
                    }
                    
                </Container>
            );
        } else {
            return (
                <Container maxWidth="md" minwidth="sm">
                    No Data Found!
                </Container>
            );
        }
        
    }
})

export default ViewEvaluation