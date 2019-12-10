import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, decorate } from 'mobx'
import axios from 'axios';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddAnswer from '../components/studentData/addAnswer'

const StudentData = observer(class StudentData extends React.Component {
    dataState = {}

    constructor(props) {
        super(props);

        this.dataState = {
            student: {},
            evaluations: [],
            answers: [],
            loading: false
        }

        decorate(this.dataState, {
            student: observable,
            answers: observable,
            evaluation: observable,
            loading: observable
        })
    }

    getStudentData = (id) => {
        return axios.get(`http://localhost:5000/api/student/check/${id}`)
    }

    getAnswersByStudent = (id) => {
        return axios.get(`http://localhost:5000/api/answer/get?student_id=${id}`)
    }

    getEvaluationByAnswers = (type, year) => {
        return axios.get(`http://localhost:5000/api/evaluation/get?type=${type}&year=${year}`)
    }

    async componentDidMount() {
        this.dataState.loading = true
        let search = this.props.location.search
        var id = search.match("id=(.+)")[1]
        var student = await this.getStudentData(id).then(response => {return response.data[0]})

        this.dataState.student = student

        var answers = await this.getAnswersByStudent(id).then(response => {return response.data})

        this.dataState.answers = answers

        for (let i = 0; i < answers.length; i++){
            this.dataState.evaluations.push(await this.getEvaluationByAnswers(answers[i].eval_type, answers[i].eval_year).then(response => {return response.data}))
        }
        console.log('evaluations', this.dataState.evaluations)
        this.dataState.loading = false
    }

    makeEvals = () => {
        let evals = []
        for (let i = 0; i < this.dataState.answers.length; i++) {
            evals.push(
                <ExpansionPanel key={i} style={{marginBottom: '5px', backgroundColor: '#3f51b5', color: 'white'}}>
                    <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>
                            {this.dataState.answers[i].eval_type} {this.dataState.answers[i].eval_year}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <AddAnswer answer={this.dataState.answers[i]} questions={this.dataState.evaluations[i].questions}/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        }
        return evals
    }

    render() {
        if (!this.dataState.loading){
        return (
            <div style={{marginTop: '65px', height: 'calc(100vh - 65px)'}}>
                <div style={{padding: '15px', width: '300px', height: '100%', float: 'left'}}>
                    <Paper style={{height: '100%', padding: '10px'}}>
                        <Grid container spacing={1} alignItems ="center" direction="column">
                            <Grid item>
                                <Typography variant="h5">
                                    <b>
                                    {this.dataState.student.first_name} {this.dataState.student.last_name}
                                    </b>
                                </Typography>
                            </Grid>
                            <Grid item style={{width: '100%'}}>
                                <Typography variant="h6">
                                    ID
                                </Typography>
                                <Typography style={{marginLeft: '10px'}}>
                                    {this.dataState.student.student_id}
                                </Typography>
                            </Grid>
                            <Grid item style={{width: '100%'}}>
                                <Typography variant="h6">
                                    Email
                                </Typography>
                                <Typography style={{marginLeft: '10px'}}>
                                    {this.dataState.student.email}
                                </Typography>
                            </Grid>
                            <Grid item style={{width: '100%'}}>
                                <Typography variant="h6">
                                    Class Year
                                </Typography>
                                <Typography style={{marginLeft: '10px'}}>
                                    {this.dataState.student.class_year}
                                </Typography>
                            </Grid>
                            <Grid item style={{width: '100%'}}>
                                <Typography variant="h6">
                                    Semester of Completion
                                </Typography>
                                <Typography style={{marginLeft: '10px'}}>
                                    {this.dataState.student.semester_of_completion}
                                </Typography>
                            </Grid>
                            <Grid item style={{width: '100%'}}>
                                <Typography variant="h6">
                                    Grade
                                </Typography>
                                <Typography style={{marginLeft: '10px'}}>
                                    {this.dataState.student.grade}
                                </Typography>
                            </Grid>
                            <Grid item style={{width: '100%'}}>
                                <Typography variant="h6">
                                    PR Major or Minor
                                </Typography>
                                <Typography style={{marginLeft: '10px'}}>
                                    {this.dataState.student.pr_major_minor}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </div>
                <div style={{padding: '5px', overflow: 'auto', width: 'calc(100% - 300px)', height: 'calc(100vh - 65px)', float: 'right'}}>
                    {this.makeEvals()}
                </div>
            </div>
        );
        }
        else{
            return (
                <div>
                    Loading...
                </div>
            )
        }
    }
})


export default StudentData