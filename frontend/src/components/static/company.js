import { Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from '../../../node_modules/mobx-react/dist/mobx-react';
import axios from 'axios';
import { observable, decorate, toJS } from 'mobx'


const CompanyForm = observer(class CompanyForm extends React.Component {
    companyState = {}
    constructor(props) {
        super(props);
        this.companyState = {
            autoFilled: false,
            phoneError: '',
            timeout: null
        }
    }

    componentDidMount() {}

    checkCompany = (name) => {
        let url = 'http://localhost:5000/api/company/check/' + name;
        return axios.get(url);
    }
    
    autoFillCompany = (name) =>{
        clearTimeout(this.companyState.timeout);
        this.companyState.timeout = setTimeout(() => {
            this.checkCompany(name).then((response) => {
                let company = response.data;
                console.log(company);
                this.companyState.autoFilled = true;
                this.props.viewEvaluationState.company_state.address = company.address;
                this.phoneChange(company.phone);
            }).catch((error) => {
                console.log('Get subscriptions error',error.response);
                if (this.companyState.autoFilled){
                    this.companyState.autoFilled = false;
                    this.props.viewEvaluationState.company_state.address = '';
                    this.phoneChange('');
                }
            });
        }, 500);
    }


    phoneChange = (value) => {
        this.props.viewEvaluationState.company_state.phone = value;
        clearTimeout(this.companyState.timeout);
        if (/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(value) || value ==''){
            this.setState({phoneError:''});
            this.props.viewEvaluationState.company_state.errorFree= true;
        }else{
            this.props.viewEvaluationState.company_state.errorFree= false;
            this.companyState.timeout = setTimeout(() => {
                    this.setState({phoneError:'Invalid phone number.'}); 
            }, 1000);
        }
        
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
                        error = {this.companyState.phoneError != ''}
                        helperText = {this.companyState.phoneError}
                        label="Phone Number"
                        InputProps={this.props.viewEvaluationState.readOnly}
                        onChange={(event) => {this.phoneChange(event.target.value)}}
                        />
                    </Grid>
                </Grid>
            </div>
        );      
    }
})

decorate(CompanyForm, {
    companyState: observable,
})

export default CompanyForm