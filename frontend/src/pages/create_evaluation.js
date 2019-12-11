import React from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select,
    MenuItem, Typography, Grid } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Question from '../components/addQuestion';
import axios from 'axios';
import * as Evaluation from '../axois/evaluation';
import { observable, decorate,toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

const CreateEvaluation =  observer(class CreateEvaluation extends React.Component {
    createState = {}
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

        this.createState = {
            redirectOnSuccess: false,
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

                var dupeQuestions = [];
                // Go through each question pulling out relevant data
                for(var i = 0; i < data.questions.length; i++) {
                    var question = data.questions[i];
                    var newQuestion = {
                        id: Number(question.order_value),
                        label: question.label,
                        question_text: question.question_text,
                        options: []
                    };

                    // Go throuh each option pulling out relevant data
                    for(var j = 0; j < question.options.length; j++) {
                        var option = question.options[j];
                        var newOption = {
                            id: Number(option.option_weight),
                            option_text: option.option_text, 
                            option_label: option.option_label,
                        };

                        newQuestion.options.push(newOption);

                    }

                    dupeQuestions.push(newQuestion);
                }


                // Update the Mobx state
                let dupeState = {
                    title: data.title,
                    eval_type: data.eval_type,
                    year: data.year,
                    version: String(version),
                    questions: dupeQuestions
                };

                // Update the State
                this.createState.createEvaluationState= dupeState;
            }).catch(error => {
                console.log(error);
            });
        }
    }

    // Functions to change state
    titleChange = (event) => {
        let value = event.target.value;
        this.createState.title= value ;
        this.createState.createEvaluationState.title = value;
    };

    typeChange = (event) => {
        let value = event.target.value;
        this.createState.eval_type = value;
        this.createState.createEvaluationState.eval_type = value;
    };
    
    yearChange = (event) => {
        let value = event.target.value;
        this.createState.year= value;
        clearTimeout(this.createState.timeout);
        if (/^(20)\d{2}$/.test(value) || value ==''){
            this.createState.yearError='';
            this.createState.yearSubmitable = true;
        }else{
            this.createState.yearSubmitable = false;
            this.createState.timeout = setTimeout(() => {
                    this.createState.yearError = 'Invalid Year'; 
            }, 1000);
        }
        this.createState.createEvaluationState.year = value;
    };

    // Add a question
    addQuestion = () => {
        let templateQuestion = {
            id: this.createState.createEvaluationState.questions.length,
            label: '',
            question_text: '',
            options: [], 
        }

        let questions = this.createState.createEvaluationState.questions;
        questions.push(templateQuestion);

        // this.createState. questions: questions});

        this.createState.createEvaluationState.questions = questions;
        this.forceUpdate();
    };
    questionsAreSubmitable = () => {//this function searches through and makes sure no fields are blank
        let questions = this.createState.createEvaluationState.questions;
        if(questions.length ==0){
            return false;
        }
        for(var i = 0; i<questions.length;i++){
            let question = questions[i];
            if (question.label.trim() == '' || question.question_text.trim() == ''){
                return false;
            }
            let options = toJS(this.createState.createEvaluationState.questions[i].options);
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
        let title = this.createState.createEvaluationState.title.trim();
        let year = this.createState.yearSubmitable && (this.createState.year);
        let type = this.createState.createEvaluationState.eval_type;
        return (title && year && type && this.questionsAreSubmitable());
    }

    // Handle Submit will format data properly
    handleSubmit = (event) => {
        console.log('I am submitting');
        
        // Need to go through each question and option to clean up data 
        // in case it has been imported
        // console.log(this.createState);
        let state = this.createState.createEvaluationState;
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
            this.createState.redirectOnSuccess = true;
          }).catch(error => console.log('here',error));
    };


    // tester = () => {
    //     let state = this.createState.createEvaluationState;
    //     let payload = {
    //         title: state.title,
    //         eval_type: state.eval_type,
    //         year: state.year,
    //         version: state.version,
    //         questions: []
    //     };

    //     // Question / Option Data
    //     for(var i = 0; i < state.questions.length; i++) {
    //         let question = state.questions[i];

    //         let newQuestion = {
    //             id: question.id,
    //             label: question.label,
    //             question_text: question.question_text,
    //             options: []
    //         };
            
    //         for(var j = 0; j < question.options.length; j++) {
    //             let option = question.options[j];

    //             let newOption;
    //             if(option.id !== undefined) {
    //                 newOption = {
    //                     id: j,
    //                     option_text: option.option_text
    //                 };
    //             } else {
    //                 newOption = {
    //                     id: Number(option.option_weight),
    //                     option_text: option.option_text
    //                 };
    //             }

    //             newQuestion.options.push(newOption);
    //         }

    //         payload.questions.push(newQuestion);
    //     }

    //     console.log(payload);
    // }
    render() {
          let style = {
            width: '90%',
            marginLeft: '5%',
          }

          if(this.createState.redirectOnSuccess) {
              return(
                <Redirect to={{
                    pathname: '/',
                    state: {
                        eval_created: true
                    }
                }}></Redirect>
              );
          }
        return (
            <div className="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-sm-1">
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
                            value={this.createState.createEvaluationState.title}
                            />
                        </Grid> 

                        {/* Type */}
                        <Grid item style = {{width: '100%'}}>
                        <FormControl fullWidth style={style}>
                            <InputLabel id="type">Type</InputLabel>
                            <Select
                            labelId="type"
                            style={{width: '100%'}}
                            value={this.createState.createEvaluationState.eval_type}
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
                            error = {this.createState.yearError != ""}
                            helperText = {this.createState.yearError}
                            style={style}
                            onChange={(event) => this.yearChange(event)}
                            value={this.createState.createEvaluationState.year}
                            />
                        </Grid>

                        {/* Version */}
                        <Grid item style = {{width: '100%', marginBottom: '10px'}}>
                            <TextField
                            id="standard-basic"
                            label="Version"
                            margin="normal"
                            style={style}
                            value={this.createState.createEvaluationState.version}
                            readOnly
                            disabled
                            />
                        </Grid>
                        {/* The real meat and potatoes of the builder */}

                        <Grid item style = {{width: '100%'}}>
                            {this.createState.createEvaluationState.questions.map((question) => 
                                <Question 
                                    question={question} 
                                    key={question.id}
                                    createEvaluationState={this.createState.createEvaluationState}
                                />
                                
                            )}
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
                            {/* <Button style = {{margin: '5px'}}color="primary"  onClick={() => this.tester()}>
                                tester
                            </Button> */}
                        </Grid>

                    
                        
                    </Grid>
                </form>
            </div>
        );
    }
})

decorate(CreateEvaluation, {
    createState: observable,
})

export default CreateEvaluation;