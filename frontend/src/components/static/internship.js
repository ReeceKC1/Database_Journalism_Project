import { Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react';
import axios from 'axios';

const InternshipForm = observer(class InternshipForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hoursError: '',
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
        clearTimeout(this.state.timeout);
        if (/^([1-9][0-9]?[0-9]?)$/.test(value) || value ==''){
            this.setState({hoursError:''});
            this.props.viewEvaluationState.internship_state.errorFree= true;
        }else{
            this.props.viewEvaluationState.internship_state.errorFree= false;
            this.state.timeout = setTimeout(() => {
                    this.setState({hoursError:'Invalid number of hours.'}); 
            }, 1000);
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
                    Internship Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        style={style}
                        label="Start Date"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.internship_state.start_date = event.target.value;}}
                        />
                    </Grid>
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        value= {this.props.viewEvaluationState.internship_state.end_date}
                        style={style}
                        label="End Date"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.internship_state.end_date = event.target.value}}
                        />
                    </Grid>
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        value= {this.props.viewEvaluationState.internship_state.hours}
                        style={style}
                        error = {this.state.hoursError != ''}
                        helperText = {this.state.hoursError}
                        label="Hours"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.hoursChange(event.target.value)}}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
})

export default InternshipForm
