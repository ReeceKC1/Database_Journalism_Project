import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react';

const StudentForm = observer(class StudentForm extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        let style = {
            width: '500px',
        }
        return (
            <Paper style={{width: '600px', padding: '10px'}}>
                <Typography variant="h5">
                    Student Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item>
                        <TextField
                        style={style}
                        label="Student ID"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.student_state.student_id = event.target.value}}
                        />
                    </Grid>
                    {!this.props.viewEvaluationState.already_exists &&
                    <Grid container spacing={1} alignItems = "center" direction = "column">
                        <Grid item>
                            <TextField
                            style={style}
                            label="First Name"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.first_name = event.target.value}}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                            style={style}
                            label="Last Name"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.last_name = event.target.value}}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                            style={style}
                            label="Email"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.email = event.target.value}}
                            />
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <InputLabel id="select-label">Class Year</InputLabel>
                                <Select
                                style={style}
                                label="select-label"
                                onChange={(event) => {this.props.viewEvaluationState.student_state.class_year = event.target.value}}
                                >
                                    <MenuItem value={"Freshman"}>Freshman</MenuItem>
                                    <MenuItem value={"Sophmore"}>Sophmore</MenuItem>
                                    <MenuItem value={"Junior"}>Junior</MenuItem>
                                    <MenuItem value={"Senior"}>Senior</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <TextField
                            style={style}
                            label="Semester of completion"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.semester_of_completion = event.target.value}}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                            style={style}
                            label="Grade"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.grade = event.target.value}}
                            />
                        </Grid>
                        <Grid item>
                            <FormControl>
                                <InputLabel id="select-label-pr-mom">PR Major or Minor</InputLabel>
                                <Select
                                style={style}
                                labelId="select-label-pr-mom"
                                onChange={(event) => {this.props.viewEvaluationState.student_state.pr_major_minor = event.target.value}}
                                >
                                    <MenuItem value={"Major"}>Major</MenuItem>
                                    <MenuItem value={"Minor"}>Minor</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    }
                </Grid>
            </Paper>
        );
    }
})

export default StudentForm