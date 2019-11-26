import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react'
import { Paper, TextField, Typography, Select, MenuItem, InputLabel, Grid, FormControl } from '@material-ui/core'

// import { Container, Table, TableHead, TableRow, TableCell, TableBody,
//     Button } from '@material-ui/core/';

const ReviewerForm = observer(class RevewerForm extends React.Component {
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
                    Reviewer Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item>
                        <TextField
                        style={style}
                        label="Reviewer Name"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.reviewer_state.reviewer_name = event.target.value; console.log(this.props.viewEvaluationState.reviewer_state.reviewer_name)}}
                        />
                    </Grid>
                </Grid>
            </Paper>
        );
    }
})

export default ReviewerForm
