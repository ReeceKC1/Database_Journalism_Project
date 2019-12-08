import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react';

const ReviewerForm = observer(class RevewerForm extends React.Component {
    render() {
        let style = {
            width: '90%',
            marginLeft: '5%',
        }
        return (
            <div style={{width: '100%', padding: '10px'}}>
                <Typography variant="h5">
                    Reviewer Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item style={{width: '100%'}}>
                        <TextField
                        style={style}
                        label="Reviewer Name"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.reviewer_state.reviewer_name = event.target.value}}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
})

export default ReviewerForm
