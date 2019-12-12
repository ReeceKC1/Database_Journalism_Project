import React from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody,
    Button, Snackbar, Grid, Paper, } from '@material-ui/core/';
import axios from 'axios';
import {Link} from 'react-router-dom';
import ViewEvalByType from '../components/home/viewEvalByType';
import StudentLookup from '../components/studentData/studentLookup'
import LabelAnalysisForm from '../components/home/labelAnalysis';

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

    handleUploadFile = (e) => {
        e.target.files
    }

    render() {

        const rows = this.state.evaluations;
        var alert = false;

        // Alert on successful submit
        if(this.props.location.state !== null && 
            this.props.location.state !== undefined && 
            this.props.location.state.eval_created) {
            alert = true;
        }
        
        return (
                <div style={{marginTop: '65px', height: 'calc(100vh - 65px)', width: '100%', overflowX: 'hidden', overflowY: 'hidden'}}>
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
                    <div  style={{height: '50%', width: '100%'}}>
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
                        </Table>
                        <div style={{overflowY: 'scroll', height: 'calc(100% - 60px)'}}>
                            <Table>
                                <TableBody >
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
                                            <input type='file' accept='csv' name='file' onChange={(e) => {this.handleUploadFile(e)}}>
                                                
                                            </input>
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
                        </div>
                    </div>
                    <div style={{height: '50%'}}>
                            <div style={{float: 'left', width: 'calc(50% - 10px)', margin: '5px', height: '100%'}}>
                                <Paper style={{padding: '10px', marginBottom: '5px'}}>
                                    <LabelAnalysisForm />
                                </Paper>
                                <Paper style={{padding: '10px'}}>
                                    <ViewEvalByType/>
                                </Paper>
                            </div>

                            <div style={{float: 'right', width: 'calc(50% - 10px)', margin: '5px', height: '100%'}}>
                                <Paper style={{padding: '10px', height: 'calc(100% - 15px)'}}>
                                        <StudentLookup/>
                                </Paper>
                            </div>
                    </div>
                </div>
        );
    }
}