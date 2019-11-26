import React from 'react';
// import { Container, Table, TableHead, TableRow, TableCell, TableBody,
//     Button } from '@material-ui/core/';

export default class CompanyForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            company_name: '',
            address: '',
            phone: '',
        };
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                This is the company form section
            </div>
        );      
    }
}
