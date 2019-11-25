import React from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody,
    Button } from '@material-ui/core/';

export default class StudentForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            student_id: '',
            first_name: '',
            last_name: '',
            email: '',
            class: '',
            semester_of_completion: '',
            grade: '',
            pr_major_minor: '',
        };
    }

    componentDidMount() {}

    render() {
        return (
            <div>
                This is the student form section
            </div>
        );
    }
}
