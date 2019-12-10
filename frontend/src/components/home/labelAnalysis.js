import React from 'react';
import { Select, MenuItem, InputLabel, TextField, Grid, FormControl, Button
} from '@material-ui/core/';

export default class LabelAnalysisForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            label: null,
            eval_type: null,
            year: null,
            end_year: null
        };
    }

    changeLabel = (label) => {
        this.setState({label: label});
    };

    changeEvalType = (type) => {
        this.setState({eval_type: type});
    };

    changeYear = (year) => {
        this.setState({year: year});
    };

    changeEndYear = (year) => {
        this.setState({end_year: year});
    };

    // TODO
    handleSubmit = () => {

    }

    render() {
        return(
            <Grid container spacing={2}>
                {/* Label */}
                <Grid item xs={2}>
                    <FormControl>
                        <TextField
                        id="label"
                        label="Label"
                        helperText="Optional"
                        onChange={(e) => this.changeLabel(e.target.value)}
                        />
                    </FormControl>
                </Grid>

                {/* Select Type */}
                <Grid item xs={3}>
                    <FormControl style={{width: '100%'}} required >
                        <InputLabel id="type_label">Evaluation Type</InputLabel>
                        <Select
                        labelId="type_label"
                        id="eval_type"
                        value={this.state.eval_type || ''}
                        required={true}
                        onChange={(e) => this.changeEvalType(e.target.value)}
                        >
                            <MenuItem value="student_eval">Student Evaluation</MenuItem>
                            <MenuItem value="student_onsite_eval">Student On-Site Evaluation</MenuItem>
                            <MenuItem value="internship_eval">Internship Evaluation</MenuItem>
                            <MenuItem value="portfolio_eval">Portfolio Evaluation</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Select Year */}
                <Grid item xs={2}>
                    <FormControl>
                    <TextField
                        id="year"
                        label="Year"
                        required={true}
                        onChange={(e) => this.changeYear(e.target.value)}
                        />
                    </FormControl>
                </Grid>

                {/* Select End Year */}
                <Grid item xs={2}>
                    <FormControl>
                    <TextField
                        id="endYear"
                        label="End Year"
                        helperText="Optional"
                        onChange={(e) => this.changeEndYear(e.target.value)}
                        />
                    </FormControl>
                </Grid>

                {/* Go Button */}
                 <Grid item xs={2}>
                    <Button variant="outlined" color="primary" style={{marginTop: '15px'}}
                        onClick={() => this.handleSubmit()}>
                        Go
                    </Button>
                </Grid>
            </Grid>
        );
    }
}