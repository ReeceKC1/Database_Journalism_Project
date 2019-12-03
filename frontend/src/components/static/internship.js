import { Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react';
import axios from 'axios';

const InternshipForm = observer(class InternshipForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoFilled: false
        }
    }

    componentDidMount() {}
    getInternship = (student_id,company_name,start_date) => {
        let url = 'http://localhost:5000/api/internship/get?student_id=' + student_id + '&company_name=' + company_name + '&start_date=' + start_date;
        return axios.get(url);
    }
    autoFillInternship = (start_date) =>{
        let company_name = this.props.viewEvaluationState.company_state.company_name;
        let student_id = this.props.viewEvaluationState.student_state.student_id;
        console.log('student_id = ', student_id,' company_name = ',company_name, ' start_date = ',start_date);

        //the calls weren't working for get internship

        this.getInternship(student_id,company_name,start_date).then((response) => {
            let internship = response.data;
            //console.log(internship);
            this.state.autoFilled = true;
            this.props.viewEvaluationState.internship_state.end_date = internship.end_date;
            this.props.viewEvaluationState.internship_state.hours = internship.hours;
       }).catch((error) => {
           console.log('Get subscriptions error',error.response);
           if (this.state.autoFilled){
            this.state.autoFilled = false;
            this.props.viewEvaluationState.internship_state.end_date = '';
            this.props.viewEvaluationState.internship_state.hours = '';
           }
        });
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
                        onChange={(event) => {this.props.viewEvaluationState.internship_state.start_date = event.target.value;
                                              this.autoFillInternship(event.target.value)}}
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
                        label="Hours"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.internship_state.hours = event.target.value}}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
})

export default InternshipForm
