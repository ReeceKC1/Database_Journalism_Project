import React from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody,
    Button, Snackbar } from '@material-ui/core/';
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
            let data = response.data;
            this.setState({evaluations: data});
        }).catch(error => console.log(error));
    }

    render() {

        const rows = this.state.evaluations;
        var alert = false;

        // Alert on successful submit
        if(this.props.location.state != undefined && this.props.location.state.eval_created) {
            alert = true;
        }
        
        return (
            <Container maxWidth="md" minwidth="sm" style={{marginTop: '75px'}}>
                {/* Alert Bar */}
                {alert &&
                    <Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    open={true}
                    autoHideDuration={5000}
                    variant='success'
                    message={<span id="message-id">Evaluation Created Successfully!</span>}
                />
                }

                {/* Table */}
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