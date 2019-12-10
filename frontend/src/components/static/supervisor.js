import { Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react';
import axios from 'axios';
import { observable, decorate } from 'mobx'

const SupervisorForm = observer(class SupervisorForm extends React.Component {
    supervisorState = {}
    constructor(props) {
        super(props);
        this.supervisorState = {
            autoFilled: false,
            emailError: '',
            timeout: null,
            timeout2: null
        }
    }

    componentDidMount() {}

    checkSupervisor = (email) => {
        let url = 'http://localhost:5000/api/supervisor/check/' + email;
        return axios.get(url);
    }
    autoFillSupervisor = (email) =>{
        clearTimeout(this.supervisorState.timeout);
        this.supervisorState.timeout = setTimeout(() => {
            this.checkSupervisor(email).then((response) => {
                let supervisor = response.data;
                //console.log(supervisor);
                this.supervisorState.autoFilled = true;
                this.props.viewEvaluationState.supervisor_state.name = supervisor.name;
                this.props.viewEvaluationState.supervisor_state.title = supervisor.title;
        }).catch((error) => {
            console.log('Get subscriptions error',error.response);
            if (this.supervisorState.autoFilled){
                this.supervisorState.autoFilled = false;
                this.props.viewEvaluationState.supervisor_state.name = '';
                this.props.viewEvaluationState.supervisor_state.title = '';
            }
            });
        }, 500);
    }

    emailChange = (value) => {
        this.props.viewEvaluationState.supervisor_state.email = value;
        this.autoFillSupervisor(value);
        clearTimeout(this.supervisorState.timeout2);
        if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) || value === ''){
            this.supervisorState.emailError = '';
            this.props.viewEvaluationState.supervisor_state.errorFree= true;
        }else{
            this.props.viewEvaluationState.supervisor_state.errorFree= false;
            this.supervisorState.timeout2 = setTimeout(() => {
                this.supervisorState.emailError = 'Invalid email address.';
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
                    Supervisor Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        style={style}
                        label="Email"
                        error = {this.supervisorState.emailError !== ''}
                        helperText = {this.supervisorState.emailError}
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.emailChange(event.target.value)}}
                        />
                    </Grid>
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        value={this.props.viewEvaluationState.supervisor_state.name}
                        style={style}
                        label="Name"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.supervisor_state.name = event.target.value}}
                        />
                    </Grid>
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        value={this.props.viewEvaluationState.supervisor_state.title}
                        style={style}
                        label="Title"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.supervisor_state.title = event.target.value}}
                        />
                    </Grid>
                </Grid>
            </div>
        ); 
    }
})

decorate(SupervisorForm, {
    supervisorState: observable,
})

export default SupervisorForm