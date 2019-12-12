import { FormControl, Grid, InputLabel, 
    MenuItem, Select, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, decorate } from 'mobx'
import axios from 'axios';

const StudentForm = observer(class StudentForm extends React.Component {
    studentState = {}
    constructor(props) {
        super(props);
        this.studentState = {
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
            timeout2: null,
            fieldSelected: ''
        }
    }

    componentDidMount() {}

    checkStudent = (value) => {
        //   student = axios.get(`http://localhost:5000/api/student/check.${id}`).then(response => {console.log(response)})
        let url = 'http://localhost:5000/api/student/check/' + value;
        return axios.get(url);
    }

    autoFillStudent= (value) =>{
        clearTimeout(this.studentState.timeout);
        this.studentState.timeout = setTimeout(() => {
            this.checkStudent(value).then((response) => {
                if(response.data.length == 1){
                    let student = response.data[0];
                    this.studentState.idError = '';
                    this.studentState.autoFilled = true;
                    this.props.viewEvaluationState.student_state.student_id = student.student_id;
                    this.props.viewEvaluationState.student_state.last_name = student.last_name;
                    this.props.viewEvaluationState.student_state.first_name = student.first_name;
                    this.props.viewEvaluationState.student_state.last_name = student.last_name;
                    this.emailChange(student.email);
                    this.props.viewEvaluationState.student_state.class_year = student.class_year;
                    this.studentState.year_value = student.class_year;
                    this.studentState.year_value = student.class_year;
                    this.semesterChange(student.semester_of_completion);
                    this.props.viewEvaluationState.student_state.grade = student.grade;
                    this.studentState.grade = student.grade;
                    this.props.viewEvaluationState.student_state.pr_major_minor = student.pr_major_minor;
                    this.studentState.pr_value = student.pr_major_minor;
                    this.forceUpdate();
                }else{
                    this.clearOutAutoFilled();
                }
            }).catch((error) => {
                console.log('Get subscriptions error',error.response);
                this.clearOutAutoFilled();
            });
        }, 500);

    }

    clearOutAutoFilled = () => {
        if (this.studentState.autoFilled){
            this.studentState.autoFilled = false;
            if(this.studentState.fieldSelected != 'student_id'){
                this.props.viewEvaluationState.student_state.student_id = '';
            }
            if(this.studentState.fieldSelected != 'first_name' && this.studentState.fieldSelected != 'last_name'){
                this.props.viewEvaluationState.student_state.first_name = '';
                this.props.viewEvaluationState.student_state.last_name = '';
            }
            this.studentState.fieldSelected ='';
            this.emailChange('');
            this.props.viewEvaluationState.student_state.class_year = '';
            this.studentState.year_value = '';
            this.semesterChange('');
            this.props.viewEvaluationState.student_state.grade = '';
            this.studentState.grade = '';
            this.props.viewEvaluationState.student_state.pr_major_minor = '';
            this.studentState.pr_value = '';
        }
    }
    idChange = (value) => {
        this.studentState.fieldSelected = 'student_id';
        this.props.viewEvaluationState.student_state.student_id = value;
        clearTimeout(this.studentState.timeout2);
        var pattern = new RegExp("^[0-9]*$");
        if (pattern.test(value) || value === ''){
            this.studentState.idError='';
            this.studentState.idSubmitable = true;
            this.autoFillStudent(value);
        }else{
            this.studentState.idSubmitable = false;
            this.studentState.timeout2 = setTimeout(() => {
                    this.studentState.idError='Invalid Baylor ID number.';
            }, 1000);
        }
        this.props.viewEvaluationState.student_state.errorFree= (this.studentState.semesterSubmitable 
                                                                && this.studentState.idSubmitable 
                                                                && this.studentState.emailSubmitable);
    }


    emailChange = (value) => {
        this.props.viewEvaluationState.student_state.email = value;
        clearTimeout(this.studentState.timeout);
        if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) || value ==''){
            this.studentState.emailError='';
            this.studentState.emailSubmitable= true;
        }else{
            this.studentState.emailSubmitable= false;
            this.studentState.timeout = setTimeout(() => {
                    this.studentState.emailError='Invalid email address.'; 
            }, 1000);
        }
        this.props.viewEvaluationState.student_state.errorFree= (this.studentState.semesterSubmitable 
            && this.studentState.idSubmitable 
            && this.studentState.emailSubmitable);
    }
    semesterChange = (value) => {
        this.props.viewEvaluationState.student_state.semester_of_completion = value;
        clearTimeout(this.studentState.timeout);
        if (/^((Spring |Summer |Fall )20)\d{2}$/.test(value) || value ==''){
            this.studentState.semesterError='';
            this.studentState.semesterSubmitable= true;
        }else{
            this.studentState.semesterSubmitable= false;
            this.studentState.timeout = setTimeout(() => {
                    this.studentState.semesterError='Format Ex: Spring 2020'; 
            }, 1000);
        }
        this.props.viewEvaluationState.student_state.errorFree = (this.studentState.semesterSubmitable 
            && this.studentState.idSubmitable 
            && this.studentState.emailSubmitable);
    }
    firstNameChange = (value) => {
        this.props.viewEvaluationState.student_state.first_name = value;
        this.studentState.fieldSelected = 'first_name';
        if(value && this.props.viewEvaluationState.student_state.last_name){
            this.autoFillStudent(value + ' '+ this.props.viewEvaluationState.student_state.last_name);
        }else{
            this.clearOutAutoFilled();
        }
    }
    lastNameChange = (value) => {
        this.props.viewEvaluationState.student_state.last_name = value;
        this.studentState.fieldSelected = 'last_name';
        if(value && this.props.viewEvaluationState.student_state.first_name){
            this.autoFillStudent(this.props.viewEvaluationState.student_state.first_name + ' ' + value);
        }else{
            this.clearOutAutoFilled();
        }
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
                    
                    {/* {!this.props.viewEvaluationState.already_exists &&
                    <div style={{width: '100%'}}> */}
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            value={this.props.viewEvaluationState.student_state.first_name}
                            style={style}
                            label="First Name"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => this.firstNameChange(event.target.value.trim())}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            value={this.props.viewEvaluationState.student_state.last_name}
                            style={style}
                            label="Last Name"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => this.lastNameChange(event.target.value.trim())}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                        <TextField
                            style={style}
                            value={this.props.viewEvaluationState.student_state.student_id}
                            label="Baylor ID#"
                            error = {this.studentState.idError !== ''}
                            helperText = {this.studentState.idError}
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => this.idChange(event.target.value.trim())}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            value={this.props.viewEvaluationState.student_state.email}
                            style={style}
                            error = {this.studentState.emailError !== ''}
                            helperText = {this.studentState.emailError}
                            label="Email"
                            InputProps={this.props.viewEvaluationState.readOnly}
                            onChange={(event) => this.emailChange(event.target.value)}
                            />
                        </Grid>
                        <Grid item style = {{width: '100%'}}>
                            <FormControl style={style}>
                                <InputLabel id="select-label">Class Year</InputLabel>
                                <Select
                                value={this.studentState.year_value}
                                style={{width: '100%'}}
                                onChange={(event) => {this.props.viewEvaluationState.student_state.class_year = event.target.value; this.studentState.year_value=event.target.value}}
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
                            error = {this.studentState.semesterError !== ''}
                            helperText = {this.studentState.semesterError}
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
                                value={this.studentState.grade}
                                style={{width: '100%'}}
                                onChange={(event) => {this.props.viewEvaluationState.student_state.grade = event.target.value; this.studentState.grade=event.target.value}}
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
                                value={this.studentState.pr_value}
                                style = {{width: '100%'}}
                                onChange={(event) => {this.props.viewEvaluationState.student_state.pr_major_minor = event.target.value; this.studentState.pr_value=event.target.value}}
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

decorate(StudentForm, {
    studentState: observable,
})

export default StudentForm