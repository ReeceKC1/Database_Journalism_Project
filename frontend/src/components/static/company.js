import { Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react';
import axios from 'axios';

const CompanyForm = observer(class CompanyForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            autoFilled: false
        }
    }

    componentDidMount() {}

    checkCompany = (name) => {
        let url = 'http://localhost:5000/api/company/check.' + name;
        return axios.get(url);
    }
    autoFillCompany = (name) =>{
        this.checkCompany(name).then((response) => {
            let company = response.data;
            //console.log(company);
            this.state.autoFilled = true;
            this.props.viewEvaluationState.company_state.address = company.address;
            this.props.viewEvaluationState.company_state.phone = company.phone;
       }).catch((error) => {
           console.log('Get subscriptions error',error.response);
           if (this.state.autoFilled){
            this.state.autoFilled = false;
            this.props.viewEvaluationState.company_state.address = '';
            this.props.viewEvaluationState.company_state.phone = '';
           }
        });
    }
    render() {
        let style = {
            width: '90%',
            marginLeft: '5%',
        }
        return (
            <div style={{width: '100%', padding: '10px', width: '100%'}}>
                <Typography variant="h5">
                    Company Information
                </Typography>
                <Grid container spacing={1} alignItems = "center" direction = "column">
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        style={style}
                        label="Company Name"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.company_state.company_name = event.target.value;
                                              this.autoFillCompany(event.target.value)}}
                        />
                    </Grid>
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        value={this.props.viewEvaluationState.company_state.address}
                        style={style}
                        label="Address"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.company_state.address = event.target.value}}
                        />
                    </Grid>
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        value={this.props.viewEvaluationState.company_state.phone}
                        style={style}
                        label="Phone Number"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.props.viewEvaluationState.company_state.phone = event.target.value}}
                        />
                    </Grid>
                </Grid>
            </div>
        );      
    }
})

export default CompanyForm