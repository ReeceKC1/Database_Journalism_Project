import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, decorate } from 'mobx'
import axios from 'axios';

const StudentData = observer(class StudentData extends React.Component {
    dataState = {}

    constructor(props) {
        super(props);

        this.dataState = {
            student: {},
            evaluations: [],
            answers: []
        }

        decorate(this.dataState, {
            student: observable,
            answers: observable,
            evaluation: observable,
        })
    }

    getStudentData = (id) => {
        return axios.get(`http://localhost:5000/api/student/check/${id}`)
    }

    getAnswersByStudent = (id) => {
        return axios.get(`http://localhost:5000/api/answer/get?student_id=${id}`)
    }

    async componentDidMount() {
        let search = this.props.location.search
        var id = search.match("id=(.+)")[1]
        console.log(id)
        var student = await this.getStudentData(id).then(response => {return response.data[0]})

        console.log("student", student)

        this.dataState.student = student

        var answers = await this.getAnswersByStudent(id).then(response => {return response.data[0]})

        this.dataState.answers = answers
    }

    render() {
        return (
            <div style={{marginTop: '65px', height: 'calc(100vh - 65px)', backgroundColor: 'red'}}>
                <div style={{padding: '15px', width: '300px', height: '100%', backgroundColor: 'blue'}}>
                    <Paper style={{height: '100%', backgroundColor: 'green'}}>
                        <Grid container spacing={1} alignItems ="center" direction="column">
                            <Grid item>
                                <Typography variant="h5">
                                    {this.dataState.student.first_name} {this.dataState.student.last_name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5"></Typography>
                            </Grid>
                        </Grid>
                        <Typography>
                            {this.dataState.student.student_id}
                        </Typography>
                    </Paper>
                </div>
                <div style={{width: 'calc(100% - 300px)', width: 'calc(100% - 300px)'}}>

                </div>
            </div>
        );
    }
})


export default StudentData