import React from 'react';
import { Container, Button, Grid, Paper, Typography } from '@material-ui/core/';
import StudentEvalStatic from '../components/static/studentEvalStatic';
import InternshipEvalStatic from '../components/static/internshipEvalStatic';
import PortfolioEvalStatic from '../components/static/portfolioEvalStatic';
import * as Evaluation from '../axois/evaluation';
import { observable, decorate, toJS } from '../../node_modules/mobx/lib/mobx'
import { observer } from '../../node_modules/mobx-react/dist/mobx-react'
import axios from 'axios';

const ViewEvaluation = observer(class ViewEvaluation extends React.Component {
    constructor(props) {
        super(props);

        const viewEvaluationState = {
            evaluation: null,
            viewOnly: false,
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
            },
            answers: [],
            eval_comment: '',
        }

        this.state = {
            viewEvaluationState: viewEvaluationState,
            type: null,
            year: null,
            submittedSuccessfully: false,
        };

        decorate(viewEvaluationState, {
            readOnly: observable,
            reviewer_state: observable,
            student_state: observable,
            internship_state: observable,
            company_state: observable,
            supervisor_state: observable,
            evaluation: observable,
            answers: observable,
            evaluation: observable,
            viewOnly: observable,
        })
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
            var view_take = window.location.href.match("#/(.+)-")[1]
            console.log("Take",view_take)
            // Setting it to the state
            this.setState({ type: type, year: year});

            if (view_take === "view"){
                this.state.viewEvaluationState.viewOnly = true
                this.state.viewEvaluationState.readOnly.readOnly = true
            }
            else{
                this.state.viewEvaluationState.viewOnly = false
                this.state.viewEvaluationState.readOnly.readOnly = false
            }
            
            Evaluation.getEvaluationByKey(type, year).then(response => {
                let data = response.data;
                console.log('Got Eval', response);

                this.state.viewEvaluationState.evaluation = data
            }).catch(error => {
                console.log(error);
            });
        }
    }
    
    isFilled = (component) => {
        for (var key of Object.keys(component)) {
            var ignoreList = ['already_exists','comment_text','errorFree'];
            if (!(ignoreList.includes(key)) && component[key].trim() == ''){
                return false;
            }
        }
        return true;
    }

    evalIsSubmittable = () => {
        let evalState = this.state.viewEvaluationState;

        var allFieldsFilledIn = true;
        if( this.state.type=='portfolio_eval'){ 
            allFieldsFilledIn = (this.isFilled(evalState.reviewer_state) && this.isFilled(evalState.student_state));
        }else {
            allFieldsFilledIn = (this.isFilled(evalState.company_state) && this.isFilled(evalState.supervisor_state)
                                && this.isFilled(evalState.student_state) && this.isFilled(evalState.internship_state));
        }

        var allQuestionsAnswered = true;
        for (var i =0; i<evalState.answers.length;i++){
            allQuestionsAnswered = allQuestionsAnswered && this.isFilled(evalState.answers[i]);
        }

        var  errorFree = true;
        if(evalState.student_state.errorFree != undefined ){
            errorFree = errorFree && evalState.student_state.errorFree;
        }
        if(evalState.company_state.errorFree != undefined ){
            errorFree = errorFree && evalState.company_state.errorFree;
        }
        if(evalState.supervisor_state.errorFree != undefined ){
            errorFree = errorFree && evalState.supervisor_state.errorFree;
        }
        if(evalState.internship_state.errorFree != undefined ){
            errorFree = errorFree && evalState.internship_state.errorFree;
        }

        return allFieldsFilledIn && allQuestionsAnswered && errorFree;
    }

    submit = (e) => {
        e.stopPropagation();
        let structure = toJS(this.state.viewEvaluationState)
        let final = {}
        
        final.eval_type = structure.evaluation.eval_type
        final.eval_year = structure.evaluation.year
        final.student = structure.student_state
        delete final.student.already_exists
        delete final.student.errorFree

        if (structure.evaluation.eval_type === 'portfolio_eval'){
            final.reviewer_name = structure.reviewer_state.reviewer_name
            final.answers = structure.answers
        }
        else{
            final.company = structure.company_state
            delete final.company.errorFree
            final.supervisor = structure.supervisor_state
            delete final.supervisor.errorFree
            final.internship = structure.internship_state
            delete final.internship.errorFree

            for (let i = 0; i < structure.answers.length; i++){
                delete structure.answers[i].comment_text
            }
            final.answers = structure.answers
            final.comment_text = structure.eval_comment
        }
        
        console.log(JSON.stringify(final))
        axios.post('http://localhost:5000/api/answer/evaluation', final).then(response => {
            console.log(response);
            this.setState({submittedSuccessfully: true});
        });
    }

    render() {
        if(this.state.submittedSuccessfully) {
            return (
                <div style={{marginLeft: '1%', marginTop: '75px'}}>
                    <Paper>
                        <Typography variant="h5" component="h3">
                            Evaluation Submitted Successfully.
                        </Typography>
                        <Typography component="p">
                            You may now return home or close the page.
                        </Typography>
                    </Paper>
                </div>
            );
        }

        if(this.state.viewEvaluationState.evaluation != null) {
            return (
                <div style={{width: '98%', marginLeft: '1%', marginTop: '75px'}}>
                    <Grid container spacing={1} alignItems ="center" direction="column">
                        {/* Rendering the header */}
                        <Grid item style={{width: '100%'}}>
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
                        </Grid>
                        {!this.state.viewEvaluationState.viewOnly &&
                        <Grid item style={{marginBottom: '25px', marginTop: '10px'}}>
                            <Button variant="contained" color="primary" onClick={(e) => this.submit(e)} disabled={!this.evalIsSubmittable()}>Submit</Button>
                        </Grid>}
                    </Grid>
                </div>
            );
        } else {
            return (
                <Container maxWidth="md" minwidth="sm">
                    Loading...
                </Container>
            );
        }
        
    }
})

export default ViewEvaluation