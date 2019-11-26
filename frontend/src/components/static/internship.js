import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react'
import { Paper, TextField, Typography, Select, MenuItem, InputLabel, Grid, FormControl } from '@material-ui/core'

// import { Container, Table, TableHead, TableRow, TableCell, TableBody,
//     Button } from '@material-ui/core/';

const InternshipForm = observer(class InternshipForm extends React.Component {
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
                    Internship Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item>
                        <TextField
                        style={style}
                        label="Start Date"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.internship_state.start_date = event.target.value}}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                        style={style}
                        label="End Date"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.internship_state.end_date = event.target.value}}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                        style={style}
                        label="Hours"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.internship_state.hours = event.target.value}}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }
})

export default InternshipForm
