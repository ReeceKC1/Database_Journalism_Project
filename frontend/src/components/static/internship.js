import React from 'react';
// import { Container, Table, TableHead, TableRow, TableCell, TableBody,
//     Button } from '@material-ui/core/';

export default class InternshipForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            start_date: '',
            end_date: '',
            hours: ''
        };
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                This is the internship form section
            </div>
        );
    }
}
