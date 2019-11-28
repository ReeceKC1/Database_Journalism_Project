import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react';
import { observable, decorate } from '../../../node_modules/mobx/lib/mobx'
import axios from 'axios';

const StudentForm = observer(class StudentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year_value: '',
            pr_value: '',
        }
        decorate(this.state, {
            year_value: observable,
            pr_value: observable
        })
    }

    componentDidMount() {}

    checkStudent = (id) => {
        // student = axios.get(`http://localhost:5000/api/student/check.${id}`).then(response => {console.log(response)})
        
    }

    render() {
        let style = {
            width: '90%',
            marginLeft: '5%',
        }
        return (
            <div style={{width: '100%', padding: '10px'}}>
                <Typography variant="h5">
                    Student Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        style={style}
                        label="Student ID"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.student_state.student_id = event.target.value; this.checkStudent(event.target.value)}}
                        />
                    </Grid>
                    {/* {!this.props.viewEvaluationState.already_exists &&
                    <div style={{width: '100%'}}> */}
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            style={style}
                            label="First Name"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.first_name = event.target.value}}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            style={style}
                            label="Last Name"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.last_name = event.target.value}}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            style={style}
                            label="Email"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.email = event.target.value}}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <FormControl style={style}>
                                <InputLabel id="select-label">Class Year</InputLabel>
                                <Select
                                value={this.state.year_value}
                                style={{width: '100%'}}
                                onChange={(event) => {this.props.viewEvaluationState.student_state.class_year = event.target.value; this.state.year_value = event.target.value}}
                                >
                                    <MenuItem value={"Freshman"}>Freshman</MenuItem>
                                    <MenuItem value={"Sophmore"}>Sophmore</MenuItem>
                                    <MenuItem value={"Junior"}>Junior</MenuItem>
                                    <MenuItem value={"Senior"}>Senior</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            style={style}
                            label="Semester of completion"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.semester_of_completion = event.target.value}}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            style={style}
                            label="Grade"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.grade = event.target.value}}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <FormControl style={style}>
                                <InputLabel id="select-label-pr-mom">PR Major or Minor</InputLabel>
                                <Select
                                value={this.state.pr_value}
                                style = {{width: '100%'}}
                                onChange={(event) => {this.props.viewEvaluationState.student_state.pr_major_minor = event.target.value; this.state.pr_value = event.target.value}}
                                >
                                    <MenuItem value={"Major"}>Major</MenuItem>
                                    <MenuItem value={"Minor"}>Minor</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    {/* </div> */}
                    
                </Grid>
            </div>
        );
    }
})

export default StudentForm