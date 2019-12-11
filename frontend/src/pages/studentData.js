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
            answers: [],
            loading: false,
            studentLoading: false,
            filteredAnswers: []
        }

        decorate(this.dataState, {
            student: observable,
            answers: observable,
            loading: observable,
            studentLoading: observable,
            filteredAnswers: observable,
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
        this.dataState.studentLoading = true
        let search = this.props.location.search
        var id = search.match("id=(.+)")[1]
        var student = await this.getStudentData(id).then(response => {return response.data[0]})

        this.dataState.student = student
        this.dataState.studentLoading = false

        var answers = await this.getAnswersByStudent(id).then(response => {return response.data})

        let evaluation = undefined
        for (let i = 0; i < answers.length; i++){
            evaluation = await this.getEvaluationByAnswers(answers[i].eval_type, answers[i].eval_year)
            evaluation = evaluation.data
            console.log(evaluation)
            this.dataState.answers.push({
                answer: answers[i],
                evaluation: evaluation
            })
        }

        this.dataState.filteredAnswers = this.dataState.answers

        this.dataState.loading = false
    }

    makeEvals = () => {
        let evals = []
        for (let i = 0; i < this.dataState.filteredAnswers.length; i++) {
            evals.push(
                <ExpansionPanel key={i} style={{marginBottom: '5px', backgroundColor: '#3f51b5', color: 'white'}}>
                    <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography>
                            {this.dataState.filteredAnswers[i].answer.eval_type} {this.dataState.filteredAnswers[i].answer.eval_year}
                        </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <AddAnswer answer={this.dataState.filteredAnswers[i].answer} questions={this.dataState.filteredAnswers[i].evaluation.questions}/>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        }
        return evals
    }

    filterEvals = (e) => {
        console.log('e',e)
        this.dataState.filteredAnswers = []
        for (let i = 0; i < this.dataState.answers.length; i++) {
            if (this.dataState.answers[i].answer.eval_type.includes(e) || this.dataState.answers[i].answer.eval_year.includes(e)){
                this.dataState.filteredAnswers.push(this.dataState.answers[i])
            }
        }
        console.log(this.dataState.filteredAnswers)
    }

    render() {
        return (
            <div style={{marginTop: '65px', height: 'calc(100vh - 65px)'}}>
                {!this.dataState.studentLoading &&
                <div style={{padding: '15px', width: '300px', height: '100%', float: 'left'}}>
                    <Paper style={{height: '100%', padding: '10px', overflow: 'auto'}}>
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
                </div>}
                {!this.dataState.loading &&
                <div style={{padding: '5px', overflow: 'auto', width: 'calc(100% - 300px)', height: 'calc(100vh - 65px)', float: 'right'}}>
                    <Paper style={{width: '100%', backgroundColor: '#cfe8fc', marginBottom: '5px'}}>
                        <TextField
                        style={{width: 'calc(100% - 30px)', marginLeft: '15px', marginBottom: '15px'}}
                        label="Filter by year or type"
                        onChange={(e) => {this.filterEvals(e.target.value)}}
                        />
                    </Paper>
                    {this.makeEvals()}
                </div>}
            </div>
        );
    }
})


export default StudentData