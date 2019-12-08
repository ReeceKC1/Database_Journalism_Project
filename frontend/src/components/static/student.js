import { FormControl, Grid, InputLabel, 
    MenuItem, Select, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, decorate } from 'mobx'
import axios from 'axios';

const StudentForm = observer(class StudentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            year_value: '',
            grade: '',
            pr_value: '',
            autoFilled: false,
            idError: '',
            idSubmitable: true,
            emailError: '',
            emailSubmitable: true,
            semesterError: '',
            semesterSubmitable: true,
            timeout: null,
            timeout2: null
        }
        decorate(this.state, {
            year_value: observable,
            grade: observable,
            pr_value: observable
        })
    }

    componentDidMount() {}

    checkStudent = (id) => {
        //   student = axios.get(`http://localhost:5000/api/student/check.${id}`).then(response => {console.log(response)})
        let url = 'http://localhost:5000/api/student/check/' + id;
        return axios.get(url);
    }

    autoFillStudent= (id) =>{
        clearTimeout(this.state.timeout);
        this.state.timeout = setTimeout(() => {
            this.checkStudent(id).then((response) => {
                let student = response.data[0];
                console.log(student);
                this.state.idError = '';
                this.state.autoFilled = true;
                this.props.viewEvaluationState.student_state.first_name = student.first_name;
                this.props.viewEvaluationState.student_state.last_name = student.last_name;
                this.emailChange(student.email);
                this.props.viewEvaluationState.student_state.class_year = student.class_year;
                this.state.year_value = student.class_year;
                this.setState({year_value : student.class_year});
                this.semesterChange(student.semester_of_completion);
                this.props.viewEvaluationState.student_state.grade = student.grade;
                this.setState({grade : student.grade});
                this.props.viewEvaluationState.student_state.pr_major_minor = student.pr_major_minor;
                this.setState({pr_value : student.pr_major_minor});

                this.forceUpdate();
        }).catch((error) => {
            console.log('Get subscriptions error',error.response);
            if (this.state.autoFilled){
                this.state.autoFilled = false;
                this.props.viewEvaluationState.student_state.first_name = '';
                this.props.viewEvaluationState.student_state.last_name = '';
                this.emailChange('');
                this.props.viewEvaluationState.student_state.class_year = '';
                this.setState({year_value : ''});
                this.semesterChange('');
                this.props.viewEvaluationState.student_state.grade = '';
                this.setState({grade : ''});
                this.props.viewEvaluationState.student_state.pr_major_minor = '';
                this.setState({pr_value : ''});
            }

            });
        }, 500);

    }


    idChange = (value) => {
    
        this.props.viewEvaluationState.student_state.student_id = value;
        clearTimeout(this.state.timeout2);
        this.autoFillStudent(value);

        var pattern = new RegExp("^[0-9]*$");
        if (pattern.test(value) || value == ''){
            this.setState({idError:''});
            this.state.idSubmitable= true;
        }else{
            this.state.idSubmitable= false;
            this.state.timeout2 = setTimeout(() => {
                    this.setState({idError:'Invalid Baylor ID number.'});
            }, 1000);
        }
        this.props.viewEvaluationState.student_state.errorFree= (this.state.semesterSubmitable 
                                                                && this.state.idSubmitable 
                                                                && this.state.emailSubmitable);
    }


    emailChange = (value) => {
        this.props.viewEvaluationState.student_state.email = value;
        clearTimeout(this.state.timeout);
        if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) || value ==''){
            this.setState({emailError:''});
            this.state.emailSubmitable= true;
        }else{
            this.state.emailSubmitable= false;
            this.state.timeout = setTimeout(() => {
                    this.setState({emailError:'Invalid email address.'}); 
            }, 1000);
        }
        this.props.viewEvaluationState.student_state.errorFree= (this.state.semesterSubmitable 
            && this.state.idSubmitable 
            && this.state.emailSubmitable);
    }
    semesterChange = (value) => {
        this.props.viewEvaluationState.student_state.semester_of_completion = value;
        clearTimeout(this.state.timeout);
        if (/^((Spring |Summer |Fall )20)\d{2}$/.test(value) || value ==''){
            this.setState({semesterError:''});
            this.state.semesterSubmitable= true;
        }else{
            this.state.semesterSubmitable= false;
            this.state.timeout = setTimeout(() => {
                    this.setState({semesterError:'Format Ex: Spring 2020'}); 
            }, 1000);
        }
        this.props.viewEvaluationState.student_state.errorFree= (this.state.semesterSubmitable 
            && this.state.idSubmitable 
            && this.state.emailSubmitable);
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
                        value={this.props.viewEvaluationState.student_state.id}
                        label="Baylor ID#"
                        error = {this.state.idError != ''}
                        helperText = {this.state.idError}
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => this.idChange(event.target.value)}
                        />
                    </Grid>
                    {/* {!this.props.viewEvaluationState.already_exists &&
                    <div style={{width: '100%'}}> */}
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            value={this.props.viewEvaluationState.student_state.first_name}
                            style={style}
                            label="First Name"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.first_name = event.target.value}}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            value={this.props.viewEvaluationState.student_state.last_name}
                            style={style}
                            label="Last Name"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => {this.props.viewEvaluationState.student_state.last_name = event.target.value}}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            value={this.props.viewEvaluationState.student_state.email}
                            style={style}
                            error = {this.state.emailError != ''}
                            helperText = {this.state.emailError}
                            label="Email"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => this.emailChange(event.target.value)}
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
                            error = {this.state.semesterError != ''}
                            helperText = {this.state.semesterError}
                            value={this.props.viewEvaluationState.student_state.semester_of_completion}
                            label="Semester of completion"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => this.semesterChange(event.target.value)}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                        <FormControl style={style}>
                                <InputLabel id="select-label">Course Grade</InputLabel>
                                <Select
                                value={this.state.grade}
                                style={{width: '100%'}}
                                onChange={(event) => {this.props.viewEvaluationState.student_state.grade = event.target.value; this.state.grade = event.target.value}}
                                >
                                    <MenuItem value={"A"}>A</MenuItem>
                                    <MenuItem value={"B"}>B</MenuItem>
                                    <MenuItem value={"C"}>C</MenuItem>
                                    <MenuItem value={"D"}>D</MenuItem>
				                    <MenuItem value={"F"}>F</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <FormControl style={style}>
                                <InputLabel id="select-label">PR Major or Minor</InputLabel>
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