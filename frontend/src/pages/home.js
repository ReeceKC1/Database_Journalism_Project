import React from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select,
    MenuItem } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount() {
        axios.get('http://localhost:5000/api/evaluation/get')
        .then(response => {
            let data = response.data.result;
            console.log(data);
        }).catch(error => console.log(error));
    }

    render() {
        return (
            <Container maxWidth="md" minwidth="sm">
                THis is the home pge
            </Container>
        );
    }
}