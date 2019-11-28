import React from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody,
    Button } from '@material-ui/core/';
import axios from 'axios';
import {Link} from 'react-router-dom';
import * as Evaluation from '../axois/evaluation';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            evaluations: []
        };
    }

    componentDidMount() {
        axios.get('http://localhost:5000/api/evaluation/get')
        .then(response => {
            let data = response.data.result;
            this.setState({evaluations: data});
        }).catch(error => console.log(error));
    }

    render() {

        const rows = this.state.evaluations;
        
        return (
            <Container maxWidth="md" minwidth="sm" style={{marginTop: '75px'}}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Evaluation Type</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Duplicate</TableCell>
                            <TableCell>View Evaluation</TableCell>
                            <TableCell>Take Evaluation</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.year + row.eval_type}>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row.eval_type}</TableCell>
                            <TableCell>{row.year}</TableCell>
                            <TableCell>{row.version}</TableCell>
                            <TableCell>
                                <Button variant="outlined" color="primary"
                                    component={Link}
                                    to={{
                                        pathname: "/create",
                                        state: {
                                            year: row.year,
                                            type: row.eval_type
                                        }
                                        
                                    }}
                                >
                                    Duplicate
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" color="primary"
                                    component={Link}
                                    to={{
                                        pathname: "/view-evaluation",
                                        search: "?type=" + row.eval_type + "&year=" + row.year
                                    }}
                                >
                                    View Evaluation
                                </Button>
                            </TableCell>
                            <TableCell>
                                <Button variant="outlined" color="primary"
                                    component={Link}
                                    to={{
                                        pathname: "/take-evaluation",
                                        search: "?type=" + row.eval_type + "&year=" + row.year
                                    }}
                                >
                                    Take Evaluation
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Container>
        );
    }
}