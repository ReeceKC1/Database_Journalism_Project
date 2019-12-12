import { Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';
import { observable, decorate } from 'mobx'

const InternshipForm = observer(class InternshipForm extends React.Component {
    internshipState = {}
    constructor(props) {
        super(props);
        this.internshipState = {
            hoursError: '',
            startError: '',
            endError: '',
            hoursSubmitable: true,
            startSubmitable: true,
            endSubmitable: true,
            timeout: null
        }
    }

    componentDidMount() {}
    getInternship = (student_id,company_name,start_date) => {
        let url = 'http://localhost:5000/api/internship/get?student_id=' + student_id + '&company_name=' + company_name + '&start_date=' + start_date;
        return axios.get(url);
    }

    
    hoursChange = (value) => {
        this.props.viewEvaluationState.internship_state.hours = value;
        clearTimeout(this.internshipState.timeout);
        if (/^([1-9][0-9]?[0-9]?)$/.test(value) || value === ''){
            this.internshipState.hoursError = '';
            this.internshipState.hoursSubmitable= true;
        }else{
            this.internshipState.hoursSubmitable= false;
            this.internshipState.timeout = setTimeout(() => {
                this.internshipState.hoursError = 'Invalid number of hours.';
            }, 1000);
        }
        this.props.viewEvaluationState.internship_state.errorFree= (this.internshipState.hoursSubmitable 
            && this.internshipState.startSubmitable 
            && this.internshipState.endSubmitable);
    }
    startChange = (value) => {
        this.props.viewEvaluationState.internship_state.start_date = value;
        clearTimeout(this.internshipState.timeout);
        if (/^((Jan |Feb |Mar |Apr |May |Jun |Jul |Aug |Sep |Oct |Nov |Dec )20)\d{2}$/.test(value) || value === ''){
            this.internshipState.startError = '';
            this.internshipState.startSubmitable= true;
        }else{
            this.internshipState.startSubmitable= false;
            this.internshipState.timeout = setTimeout(() => {
                this.internshipState.startError = 'Format Ex: Jan 2020';
            }, 1000);
        }
        this.props.viewEvaluationState.internship_state.errorFree= (this.internshipState.hoursSubmitable 
            && this.internshipState.startSubmitable 
            && this.internshipState.endSubmitable);
    }
    endChange = (value) => {
        this.props.viewEvaluationState.internship_state.end_date = value;
        clearTimeout(this.internshipState.timeout);
        if (/^((Jan |Feb |Mar |Apr |May |Jun |Jul |Aug |Sep |Oct |Nov |Dec )20)\d{2}$/.test(value) || value === ''){
            this.internshipState.endError = '';
            this.internshipState.endSubmitable= true;
        }else{
            this.internshipState.endSubmitable= false;
            this.internshipState.timeout = setTimeout(() => {
                this.internshipState.endError = 'Format Ex: Jan 2020';
            }, 1000);
        }
        this.props.viewEvaluationState.internship_state.errorFree= (this.internshipState.hoursSubmitable 
            && this.internshipState.startSubmitable 
            && this.internshipState.endSubmitable);
    }
    render() {
        let style = {
            width: '90%',
            marginLeft: '5%',
        }
        return (
            <div style={{width: '100%', padding: '10px'}}>
                <Typography variant="h5">
                    Internship Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        style={style}
                        label="Start Month"
                        error = {this.internshipState.startError !== ''}
                        helperText = {this.internshipState.startError}
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.startChange(event.target.value)}}
                        />
                    </Grid>
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        value= {this.props.viewEvaluationState.internship_state.end_date}
                        style={style}
                        error = {this.internshipState.endError !== ''}
                        helperText = {this.internshipState.endError}
                        label="End Month"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.endChange(event.target.value)}}
                        />
                    </Grid>
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        value= {this.props.viewEvaluationState.internship_state.hours}
                        style={style}
                        error = {this.internshipState.hoursError !== ''}
                        helperText = {this.internshipState.hoursError}
                        label="Total Hours"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.hoursChange(event.target.value)}}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
})

decorate(InternshipForm, {
    internshipState: observable,
})

export default InternshipForm
