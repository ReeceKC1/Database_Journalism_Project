import React from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody,
    Button, Snackbar, Typography, Paper, } from '@material-ui/core/';
import axios from 'axios';
import {Link} from 'react-router-dom';
import ViewEvalByType from '../components/home/viewEvalByType';
import StudentLookup from '../components/studentData/studentLookup'
import LabelAnalysisForm from '../components/home/labelAnalysis';
import { globalState } from '../state'
import LoadingIcon from '../components/loadingIcon'
import { observer } from 'mobx-react'

const Home = observer(class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            evaluations: [],
            alertOpen : true
        };
    }

    componentDidMount() {
        globalState.appState.loadingMessage = 'Loading...'
        globalState.appState.isLoading = true
        axios.get('http://localhost:5000/api/evaluation/get')
        .then(response => {
            let data = response.data;
            this.setState({evaluations: data});
            globalState.appState.isLoading = false
        }).catch(error => {
            globalState.appState.isLoading = false
            console.log(error)
        });
    }

    convertTypeToName = (type) =>{
        var displayType = '';
        if(type =='student_eval'){
            displayType = 'Student Evaluation';
        }
        if(type =='student_onsite_eval'){
            displayType = 'Student On-Site Evaluation';
        }
        if(type =='internship_eval'){
            displayType = 'Internship Evaluation';
        }
        if(type =='portfolio_eval'){
            displayType = 'Portfolio Evaluation';
        }
        return displayType;
    }

    loadFileAsText(year, type, e){
        globalState.appState.loadingMessage = "Uploading CSV"
        globalState.appState.isLoading = true
        var fileToLoad = e.target.files[0];
        let payload ={
            eval_type: type,
            eval_year: year,
            file: 'no data'
            }
        var fileReader = new FileReader();
        fileReader.readAsText(new Blob([fileToLoad]), "UTF-8");
        fileReader.onload = function(fileLoadedEvent){
            var textFromFileLoaded = fileLoadedEvent.target.result;
            payload.file = textFromFileLoaded;
            console.log('loaded',payload);

            axios.post('http://localhost:5000/api/file-upload', payload)
            .then(response => {
                globalState.appState.isLoading = false
                console.log(response);
            }).catch(error => {
                globalState.appState.isLoading = false
                console.log('here',error)
            });
        };

       
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
                        open={this.state.alertOpen}
                        autoHideDuration={5000}
                        variant='success'
                        onClose={() => this.setState({alertOpen: false})}
                        message={<span id="message-id">Evaluation Created Successfully!</span>}
                        />
                    }

                    {/* Table */}
                    <div  style={{height: 'calc(100% - 315px)', width: '100%'}}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{width: '275px'}}>Title</TableCell>
                                    <TableCell style={{width: '175px'}}>Evaluation Type</TableCell>
                                    <TableCell style={{width: '75px'}}>Year</TableCell>
                                    <TableCell style={{width: '100px'}}>Version</TableCell>
                                    <TableCell style={{width: '200px'}}>Duplicate</TableCell>
                                    <TableCell>CSV Upload</TableCell>
                                    <TableCell>View Evaluation</TableCell>
                                    <TableCell>Take Evaluation</TableCell>
                                </TableRow>
                            </TableHead>
                        </Table>
                        <div style={{overflowY: 'scroll', height: 'calc(100% - 60px)'}}>
                            {!globalState.appState.isLoading &&
                            <Table>
                                <TableBody>
                                {rows.map(row => (
                                    <TableRow key={row.year + row.eval_type}>
                                        <TableCell style={{width: '275px'}}>{row.title}</TableCell>
                                        <TableCell style={{width: '175px'}}>{this.convertTypeToName(row.eval_type)}</TableCell>
                                        <TableCell style={{width: '75px'}}>{row.year}</TableCell>
                                        <TableCell style={{width: '100px'}}>{row.version}</TableCell>
                                        <TableCell style={{width: '200px'}}>
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
                                            <input style={{width: '90px'}} type='file' id='fileToLoad' accept='csv' name='file' onChange={(e) => {this.loadFileAsText(row.year,row.eval_type, e); e.target.value = null}}/>
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
                            </Table>}
                            {globalState.appState.isLoading &&
                            <LoadingIcon/>}
                        </div>
                    </div>
                    <div style={{height: '315px'}}>
                            <div style={{float: 'left', width: 'calc(50% - 10px)', margin: '5px', height: '100%'}}>
                                <Paper style={{padding: '10px', marginBottom: '5px'}}>
                                    <Typography variant='h5'>
                                        Label Analysis
                                    </Typography>
                                    <LabelAnalysisForm/>
                                </Paper>
                                <Paper style={{padding: '10px',paddingBottom: '10px'}}>
                                    <Typography variant='h5'>
                                        Search Reviews by Type
                                    </Typography>
                                    <ViewEvalByType/>
                                </Paper>
                            </div>

                            <div style={{float: 'right', width: 'calc(50% - 10px)', margin: '5px', height: '100%'}}>
                                <Paper style={{padding: '10px', height: 'calc(100% - 15px)'}}>
                                    <Typography variant='h5'>
                                        Student Lookup
                                    </Typography>
                                    <StudentLookup/>
                                </Paper>
                            </div>
                    </div>
                </div>
        );
    }
})

export default Home