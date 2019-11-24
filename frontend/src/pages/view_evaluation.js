import React from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody,
    Button } from '@material-ui/core/';
import axios from 'axios';
import {NavLink, Link} from 'react-router-dom';

export default class ViewEvaluation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            evaluation: null
        };
    }

    // Make the call based on params
    componentDidMount() {
        if(this.props.location !== undefined) {
            let search = this.props.location.search
            var typePatt = "=(.+)&";
            var yearPatt = "year=(.+)"


            var type = search.match(typePatt)[1];
            var year = search.match(yearPatt)[1]
            
            const url = 'http://localhost:5000/api/evaluation/get?type='+ type + '&year=' + year;
            axios.get(url).then(response => {
                let data = response.data;
                console.log('Got Eval', response);

                this.setState({evaluation: data});
            }).catch(error => {
                console.log(error);
            });
        }
    }

    render() {
        if(this.state.evaluation != null) {
            return (
                <Container maxWidth="md" minwidth="sm">
                    {JSON.stringify(this.state.evaluation)}
                </Container>
            );
        } else {
            return (
                <Container maxWidth="md" minwidth="sm">
                    No Data Found!
                </Container>
            );
        }
        
    }
}