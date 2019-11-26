import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react';

const SupervisorForm = observer(class SupervisorForm extends React.Component {
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
                    Supervisor Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item>
                        <TextField
                        style={style}
                        label="Email"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.supervisor_state.email = event.target.value}}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                        style={style}
                        label="Name"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.supervisor_state.name = event.target.value}}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                        style={style}
                        label="Title"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.supervisor_state.title = event.target.value}}
                        />
                    </Grid>
                </Grid>
            </Paper>
        ); 
    }
})

export default SupervisorForm