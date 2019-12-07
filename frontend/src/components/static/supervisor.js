import { Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react';
import axios from 'axios';

const SupervisorForm = observer(class SupervisorForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoFilled: false,
            timeout: null
        }
    }

    componentDidMount() {}

    checkSupervisor = (email) => {
        let url = 'http://localhost:5000/api/supervisor/check/' + email;
        return axios.get(url);
    }
    autoFillSupervisor = (email) =>{
        clearTimeout(this.state.timeout);
        this.state.timeout = setTimeout(() => {
            this.checkSupervisor(email).then((response) => {
                let supervisor = response.data;
                //console.log(supervisor);
                this.state.autoFilled = true;
                this.props.viewEvaluationState.supervisor_state.name = supervisor.name;
                this.props.viewEvaluationState.supervisor_state.title = supervisor.title;
        }).catch((error) => {
            console.log('Get subscriptions error',error.response);
            if (this.state.autoFilled){
                this.state.autoFilled = false;
                this.props.viewEvaluationState.supervisor_state.name = '';
                this.props.viewEvaluationState.supervisor_state.title = '';
            }
            });
        }, 500);
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
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.supervisor_state.email = event.target.value;
                                              this.autoFillSupervisor(event.target.value)}}
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

export default SupervisorForm