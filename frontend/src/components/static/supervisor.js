import React from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody,
    Button } from '@material-ui/core/';

export default class SupervisorForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            name: '',
            title: ''
        };
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                This is the supervisor form section
            </div>
        ); 
    }
}
