import React from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select,
    MenuItem, Typography, Grid } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Question from '../components/addQuestion';
import axios from 'axios';
import * as Evaluation from '../axois/evaluation';
import { observable, decorate,toJS } from 'mobx';
import { observer } from 'mobx-react';

const CreateEvaluation =  observer(class CreateEvaluation extends React.Component {
    constructor(props) {
        super(props);

        const createEvaluationState = {
            title: '',
            eval_type: '',
            year: '',
            version: '1',
            questions: []
        }

        decorate(createEvaluationState, {
           title: observable,
           eval_type: observable,
           year: observable,
           questions: observable
        });

        this.state = {
            title: '',
            eval_type: '',
            year: '',
            version: '1',
            yearError: '',
            yearSubmitable: false,
            timeout: null,
            createEvaluationState: createEvaluationState
        };
    }

    // If data was passed in render it
    componentDidMount() {
        if(this.props.location !== undefined 
            && this.props.location.state !== undefined 
            && this.props.location.state !== null
            && this.props.location.state.type !== null
            && this.props.location.state.year !== null) {
            let propState = this.props.location.state;
            let type = propState.type;
            let year = propState.year;

            Evaluation.getEvaluationByKey(type, year).then(response => {
                let data = response.data;
                console.log('Got Eval', response);

                // Increment Version
                let version = Number(data.version);
                version++;

                // Add id's to questions
                let questions = data.questions;
                for(var i = 0; i < questions.length; i++) {
                    let question = questions[i];
                    question.id = i;
                }

                // Update the State
                this.setState({
                    title: data.title,
                    eval_type: data.eval_type,
                    year: data.year,
                    version: String(version),
                    questions: questions
                });
            }).catch(error => {
                console.log(error);
            });
        }
    }

    // Functions to change state
    titleChange = (event) => {
        let value = event.target.value;
        this.setState({ title: value });
        this.state.createEvaluationState.title = value;
    };

    typeChange = (event) => {
        let value = event.target.value;
        this.setState({ eval_type: value });
        this.state.createEvaluationState.eval_type = value;
    };
    
    yearChange = (event) => {
        let value = event.target.value;
        this.setState({ year: value });
        clearTimeout(this.state.timeout);
        if (/^(20)\d{2}$/.test(value) || value ==''){
            this.setState({yearError:''});
            this.setState({yearSubmitable: true });
        }else{
            this.setState({yearSubmitable: false});
            this.state.timeout = setTimeout(() => {
                    this.setState({yearError:'Invalid Year'}); 
            }, 1000);
        }
        this.state.createEvaluationState.year = value;
    };

    // Add a question
    addQuestion = () => {
        let templateQuestion = {
            id: this.state.createEvaluationState.questions.length,
            label: '',
            question_text: '',
            options: [], 
        }

        let questions = this.state.createEvaluationState.questions;
        questions.push(templateQuestion);

        // this.setState({ questions: questions});

        this.state.createEvaluationState.questions = questions;
    };
    questionsAreSubmitable = () => {//this function searches through and makes sure no fields are blank
        let questions = this.state.createEvaluationState.questions;
        if(questions.length ==0){
            return false;
        }
        for(var i = 0; i<questions.length;i++){
            let question = questions[i];
            if (question.label.trim() == '' || question.question_text.trim() == ''){
                return false;
            }
            let options = toJS(this.state.createEvaluationState.questions[i].options);
            if(options.length == 0){
                return false;
            }
            for (var j=0; j<options.length;j++){
                if(options[j].option_text.trim()==''){
                    return false;
                }
            }
        } 
        return true;
    }
    isSubmitable = () => {
        let title = this.state.title.trim();
        let year = this.state.yearSubmitable && (this.state.year);
        let type = this.state.eval_type;
        return (title && year && type && this.questionsAreSubmitable());
    }

    // Handle Submit will format data properly
    handleSubmit = (event) => {
        console.log('I am submitting');
        
        // Need to go through each question and option to clean up data 
        // in case it has been imported
        // console.log(this.state);
        let state = this.state.createEvaluationState;
        let payload = {
            title: state.title,
            eval_type: state.eval_type,
            year: state.year,
            version: state.version,
            questions: []
        };

        // Question / Option Data
        for(var i = 0; i < state.questions.length; i++) {
            let question = state.questions[i];

            let newQuestion = {
                id: question.id,
                label: question.label,
                question_text: question.question_text,
                options: []
            };
            
            for(var j = 0; j < question.options.length; j++) {
                let option = question.options[j];

                let newOption;
                if(option.id !== undefined) {
                    newOption = {
                        id: j,
                        option_text: option.option_text
                    };
                } else {
                    newOption = {
                        id: Number(option.option_weight),
                        option_text: option.option_text
                    };
                }

                newQuestion.options.push(newOption);
            }

            payload.questions.push(newQuestion);
        }

        console.log(payload);

        // Actually Submitting the Data 
        axios.post('http://localhost:5000/api/evaluation/create', payload)
        .then(response => {
            console.log(response);
          }).catch(error => console.log('here',error));
    };

    render() {
        const useStyles = makeStyles(theme => ({
            container: {
              marginBottom: '10px'
            },
            textField: {
              marginLeft: theme.spacing(1),
              marginRight: theme.spacing(1),
              width: 200,
            },

          }));

        //   Function to Reder All Questions
        //TODO: Update to MOBX
          const renderQuestions = this.state.createEvaluationState.questions.map((question) => 
            <Question 
                question={question} 
                key={question.id}
                createEvaluationState={this.state.createEvaluationState}
            />
            
          );

          let style = {
            width: '90%',
            marginLeft: '5%',
          }

        return (
            <div style={{width: '50%', marginLeft: '25%', marginTop: '75px'}}>
                <Typography variant="h3">
                        Create Evaluation
                        
                </Typography>
                
                <form style={{padding: '10px'}} noValidate autoComplete="off" onSubmit={() => this.handleSubmit()} >
                    <Typography variant="h5" style={{marginTop: '10px'}}>
                        Evaluation Form Information
                    </Typography>
                    <p style= {{fontSize: '12px', color:'grey'}}>All fields are required.</p>
                    {/* Title */}
                    <Grid  container spacing={1} alignItems ="center" direction="column">
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            id="standard-basic"
                            label="Evaluation Title"
                            margin="normal"
                            style={style}
                            onChange={(event) => this.titleChange(event)}
                            value={this.state.title}
                            />
                        </Grid> 

                        {/* Type */}
                        <Grid item style = {{width: '100%'}}>
                        <FormControl fullWidth style={style}>
                            <InputLabel id="type">Type</InputLabel>
                            <Select
                            labelId="type"
                            style={{width: '100%'}}
                            value={this.state.eval_type}
                            onChange={(event) => this.typeChange(event)}
                            >
                                <MenuItem value="student_eval">Student Evaluation</MenuItem>
                                <MenuItem value="student_onsite_eval">Student On-Site Evaluation</MenuItem>
                                <MenuItem value="internship_eval">Internship Evaluation</MenuItem>
                                <MenuItem value="portfolio_eval">Portfolio Evaluation</MenuItem>
                            </Select>
                        </FormControl>
                        </Grid>

                        {/* Year */}
                        <Grid item style = {{width: '100%'}}>
                            <TextField
                            id="standard-basic"
                            label="Year"
                            margin="normal"
                            error = {this.state.yearError != ""}
                            helperText = {this.state.yearError}
                            style={style}
                            onChange={(event) => this.yearChange(event)}
                            value={this.state.year}
                            />
                        </Grid>

                        {/* Version */}
                        <Grid item style = {{width: '100%', marginBottom: '10px'}}>
                            <TextField
                            id="standard-basic"
                            label="Version"
                            margin="normal"
                            style={style}
                            value={this.state.version}
                            readOnly
                            disabled
                            />
                        </Grid>
                        {/* The real meat and potatoes of the builder */}

                        <Grid item style = {{width: '100%'}}>
                            {renderQuestions}
                        </Grid>

                        <Grid item style = {{width: '100%', marginBottom: '25px'}}>
                            <Typography>
                                Evaluation Options
                            </Typography>
                            <Button style = {{margin: '5px'}} variant="contained" color="primary" type="button" onClick={() => this.addQuestion()}>
                                Add Question
                            </Button>
                            <Button style = {{margin: '5px'}} variant="contained" color="primary" type="submit" disabled={!this.isSubmitable()}>
                                Create Evaluation
                            </Button>
                        </Grid>

                    
                        
                    </Grid>
                </form>
            </div>
        );
    }
})

export default CreateEvaluation