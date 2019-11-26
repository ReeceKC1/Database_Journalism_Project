import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react'
import { Paper, TextField, Typography, Select, MenuItem, InputLabel, Grid, FormControl } from '@material-ui/core'

// import { Container, Table, TableHead, TableRow, TableCell, TableBody,
//     Button } from '@material-ui/core/';

const CompanyForm = observer(class CompanyForm extends React.Component {
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
                    Company Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item>
                        <TextField
                        style={style}
                        label="Company Name"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.company_state.company_name = event.target.value}}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                        style={style}
                        label="Address"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.company_state.address = event.target.value}}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                        style={style}
                        label="Phone Number"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.company_state.phone = event.target.value}}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );      
    }
})

export default CompanyForm