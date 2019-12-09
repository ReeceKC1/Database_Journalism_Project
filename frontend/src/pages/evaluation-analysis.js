import React from 'react';
import { Container, Typography, Paper
} from '@material-ui/core/';
import axios from 'axios';
import {Link} from 'react-router-dom';
import * as Evaluation from '../axois/evaluation';
import EvalExpansionPanel from '../components/evaluationAnaylsis/evalExpansionPanel';

export default class EvaluationAnalysis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            evaluationList: null,
            valid_eval_type: true,
            eval_type: ''
        };
    }

    // Loadin all evaluations here
    componentDidMount() {
        // Getting type of evaluation from search url
        if(this.props.location.search !== undefined) {
            var location = this.props.location.search;
            var pattern = new RegExp("=.+");
            var regex = pattern.exec(location);

            // Checking to see if i split the string properly
            if(regex == null) {
                this.setState({valid_eval_type: false});
            } else {
                var type = regex[0].substr(1, regex[0].length);

                this.setState({eval_type: type});
                console.log(type);

                Evaluation.getEvaluationsByType(type).then(response => {
                    this.setState({evaluationList: response.data});
                    console.log(response.data);
                }).catch(error => {
                    this.setState({evaluationList: []});
                    console.log(error.response)
                });
            }
        } else {
            this.setState({valid_eval_type: false});
        }
        
        

    }


    render() {
        if(!this.state.valid_eval_type) {
            return(
                <Container maxWidth="md" minwidth="sm" style={{marginTop: '75px'}}>
                    <div>
                        There was a problem loading this page
                    </div>
                </Container>
            );
        } 
        
        // Check if the object is null could be still loading
        else if(this.state.evaluationList !== null) {
            // Check if the list is empty
            if(this.state.evaluationList.length !== 0) {
                return(
                    <Container maxWidth="md" minwidth="sm" style={{marginTop: '75px'}}>
                        <Typography variant="h5" component="h3">
                            Evaluation Type: {this.state.eval_type}
                        </Typography>
    
                        {this.state.evaluationList.map((evaluation) => 
                            <EvalExpansionPanel 
                                evaluation={evaluation} 
                                key={evaluation.eval_type + evaluation.year}
                            />
                        )}
                        
                        
                    </Container>
                );
            } else {
                return(
                    <Container maxWidth="md" minwidth="sm" style={{marginTop: '75px'}}>
                        <Typography variant="h5" component="h3">
                            Evaluation Type: {this.state.eval_type}
                        </Typography>
    
                        <Paper style={{padding: '10px'}}>
                            No reviews found!
                        </Paper>     
                    </Container>
                );
            }
            
        } else {
            return (
                <Container maxWidth="md" minwidth="sm" style={{marginTop: '75px'}}>
                    Loading...
                </Container>
            );
        }
    }
}
