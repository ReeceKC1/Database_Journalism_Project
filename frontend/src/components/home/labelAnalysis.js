import React from 'react';
import { Select, MenuItem, InputLabel, TextField, Grid, FormControl, Button, FormHelperText
} from '@material-ui/core/';
import {Redirect} from 'react-router-dom';

export default class LabelAnalysisForm extends React.Component {
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
            searchParams: null,
            redirect: false,
        };
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
        this.setState({
            year: year,
            year_error: false,
            displayYearError: false
        });
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
            if(this.state.label !== null) {
                searchParams += '&label=' + this.state.label;
            }

            // Setting end year
            if(this.state.end_year !== null) {
                searchParams += '&end_year=' + this.state.end_year;
            }

            // Setting State
            this.setState({
                searchParams: searchParams,
                redirect: true,
            });

        }

    }

    render() {
        // Redirect to the page upon clicking "GO"
        if(this.state.redirect) {
            return (
                <Redirect to={{
                    pathname: '/label-analysis',
                    search: this.state.searchParams
                }}/>
            );
        }

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
                    {/* Error */}
                    {this.state.displayEvalError &&
                        <FormControl style={{width: '100%'}} required error>
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
                            <FormHelperText>Required!</FormHelperText>
                        </FormControl>
                    }

                    {/* No Error */}
                    {!this.state.displayEvalError &&
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
                    }
                </Grid>

                {/* Select Year */}
                <Grid item xs={2}>
                    {/* Display Error */}
                    {this.state.displayYearError &&
                        <FormControl>
                        <TextField
                            error
                            id="year"
                            label="Year"
                            helperText="Required!"
                            required={true}
                            defaultValue={this.state.year}
                            onChange={(e) => this.changeYear(e.target.value)}
                            />
                    </FormControl>
                    }

                    {/* No Error */}
                    {!this.state.displayYearError &&
                        <FormControl>
                            <TextField
                                id="year"
                                label="Year"
                                required={true}
                                defaultValue={this.state.year}
                                onChange={(e) => this.changeYear(e.target.value)}
                                />
                        </FormControl>
                    }
                    
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