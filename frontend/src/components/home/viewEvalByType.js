import React from 'react';
import { Paper, Grid, MenuItem, Select, InputLabel, FormControl, Button,
    FormHelperText, Typography
} from '@material-ui/core/';
import {Redirect} from 'react-router-dom';

export default class ViewEvalByType extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eval_type: null,
            error: false,
            errorMsg: '',
            redirect: false,
            redirectUrl: ''
        };
    }

    handleTypeChange = (type) => {
        this.setState({ eval_type: type,
                        error: false});
    }

    goToType = () => {
        if(this.state.eval_type === null) {
            this.setState({error: true, 
                            errorMsg: 'You must select and option!'});
        } else {
            // This is where I choose which link to redirect to
            var search = '?type=' + this.state.eval_type;
            this.setState({
                redirect: true,
                redirectUrl: search
            });
            
        }
    }

    render() {
        // Where I redirect to the correct page
        if(this.state.redirect) {
            return (
                <Redirect to={{
                    pathname: '/evaluation-analysis',
                    search: this.state.redirectUrl
                }}
                />
            )
        }


        if(!this.state.error) {
            return (
                <div style={{width: '100%'}}>
                    <Grid container spacing={2}>
                        <Grid item style={{width: 'calc(100% - 80px)'}}>
                            {/* Select Type */}
                            <FormControl style={{width: '100%'}}>
                                <InputLabel id="type_label">Evaluation Type</InputLabel>
                                <Select
                                labelId="type_label"
                                id="eval_type"
                                value={this.state.eval_type || ''}
                                onChange={(e) => this.handleTypeChange(e.target.value)}
                                >
                                    <MenuItem value="student_eval">Student Evaluation</MenuItem>
                                    <MenuItem value="student_onsite_eval">Student On-Site Evaluation</MenuItem>
                                    <MenuItem value="internship_eval">Internship Evaluation</MenuItem>
                                    <MenuItem value="portfolio_eval">Portfolio Evaluation</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
    
                        {/* Button */}
                        <Grid item>
                            <Button variant="outlined" color="primary" style={{marginTop: '15px'}}
                                onClick={() => this.goToType()}>
                                Go
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            );
        } else {
            return (
                <div style={{width: '100%'}}>
                    <Grid container spacing={2}>
                        <Grid item>
                            {/* Select Type */}
                            <FormControl style={{width: '100%'}} error>
                                <InputLabel id="type_label">Evaluation Type</InputLabel>
                                <Select
                                labelId="type_label"
                                id="eval_type"
                                value={this.state.eval_type || ''}
                                onChange={(e) => this.handleTypeChange(e.target.value)}
                                >
                                    <MenuItem value="student_eval">Student Evaluation</MenuItem>
                                    <MenuItem value="student_onsite_eval">Student On-Site Evaluation</MenuItem>
                                    <MenuItem value="internship_eval">Internship Evaluation</MenuItem>
                                    <MenuItem value="portfolio_eval">Portfolio Evaluation</MenuItem>
                                </Select>
                                <FormHelperText>{this.state.errorMsg}</FormHelperText>
                            </FormControl>
                        </Grid>
    
                        {/* Button */}
                        <Grid item>
                            <Button variant="outlined" color="primary" style={{marginTop: '15px'}}
                                onClick={() => this.goToType()}>
                                Go
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            );
        }
        
    }
}