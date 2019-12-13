import React from 'react';
import { Typography, Select, MenuItem, InputLabel, TextField, Grid, FormControl, Button, FormHelperText
} from '@material-ui/core/';
import {withRouter} from 'react-router-dom';

class LabelAnalysisForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            label: null,
            eval_type: null,
            year: null,
            end_year: null,
            eval_error: true,
            year_error: true,
            displayEvalError: false,
            displayYearError: false,
        };
    }

    componentDidMount() {
        if(this.props.label !== undefined) {
            this.setState({label: this.props.label});
        }

        if(this.props.eval_type !== undefined) {
            this.setState({
                eval_type: this.props.eval_type,
                eval_error: false
            });
        }

        if(this.props.year !== undefined) {
            this.setState({
                year: this.props.year,
                year_error: false,
            });
        }

        if(this.props.end_year !== undefined) {
            this.setState({end_year: this.props.end_year});
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.label !== prevProps.label) {
            this.setState({label: this.props.label});
        }

        if(this.props.eval_type !== prevProps.eval_type) {
            this.setState({
                eval_type: this.props.eval_type,
                eval_error: false
            });
        }

        if(this.props.year !== prevProps.year) {
            this.setState({
                year: this.props.year,
                year_error: false,
            });
        }

        if(this.props.end_year !== prevProps.end_year) {
            this.setState({end_year: this.props.end_year});
        }

        
    }

    changeLabel = (label) => {
        this.setState({label: label});
    };

    changeEvalType = (type) => {
        this.setState({
            eval_type: type,
            eval_error: false,
            displayEvalError: false
        });
    };

    changeYear = (year) => {
        if(year === '') {
            this.setState({
                year: year,
                year_error: true,
                displayYearError: false
            });
        } else {
            this.setState({
                year: year,
                year_error: false,
                displayYearError: false
            });
        }
        
    };

    changeEndYear = (year) => {
        this.setState({end_year: year});
    };

    // TODO
    handleSubmit = () => {
        // If both aren't set
        if(this.state.eval_error && this.state.year_error) {
            this.setState({
                displayEvalError: true,
                displayYearError: true
            });
        } 
        // If there is just a year error
        else if(!this.state.eval_error && this.state.year_error) {
            this.setState({displayYearError: true});
        }
        // If there is just a type error
        else if(this.state.eval_error && !this.state.year_error) {
            this.setState({displayEvalError: true});
        }

        // No errors, then take them to a new page
        else {
            var searchParams = '?type=' + this.state.eval_type + '&year=' + this.state.year;

            // Setting label
            if(this.state.label !== null && this.state.label !== '') {
                searchParams += '&label=' + this.state.label;
            }

            // Setting end year
            if(this.state.end_year !== null && this.state.end_year !== '') {
                searchParams += '&end_year=' + this.state.end_year;
            }

            const url = '/label-analysis' + searchParams;
            this.props.history.push(url);

        }

    }

    render() {
        return(
            <div style={{height: '100%', width: '100%'}}>
                <Grid container spacing={2}>
                    {/* Label */}
                    <Grid item style={{width: '50%'}}>
                        <FormControl style={{width: '100%'}}>
                            <TextField
                            id="label"
                            label="Label"
                            style={{width: '100%'}}
                            helperText="Optional"
                            value={this.state.label || ''}
                            onChange={(e) => this.changeLabel(e.target.value)}
                            />
                        </FormControl>
                    </Grid>

                    {/* Select Type */}
                    <Grid item style={{width: '50%'}}>
                        {/* Error */}
                        
                            <FormControl style={{width: '100%'}} required error={this.state.displayEvalError}>
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
                                {this.state.displayEvalError &&
                                <FormHelperText>Required!</FormHelperText>
                                }
                            </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    {/* Select Year */}
                    <Grid item style={{width: 'calc(50% - 100px)'}}>
                        {/* Display Error */}
                        
                            <FormControl style={{width: '100%'}}>
                            <TextField
                                error={this.state.displayYearError}
                                id="year"
                                label="Year"
                                style={{width: '100%'}}
                                required={true}
                                value={this.state.year || ''}
                                onChange={(e) => this.changeYear(e.target.value)}
                                />
                                {this.state.displayYearError &&
                                    <FormHelperText style={{color:'red'}}>Required!</FormHelperText>
                                }
                        </FormControl>
                    </Grid>

                    {/* Select End Year */}
                    <Grid item style={{width: 'calc(50% - 100px)'}}>
                        <FormControl style={{width: '100%'}}>
                        <TextField
                            id="endYear"
                            label="End Year"
                            style={{width: '100%'}}
                            helperText="Optional"
                            value={this.state.end_year || ''}
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
            </div>
        );
    }
}

export default withRouter(LabelAnalysisForm);