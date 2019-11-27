import React from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select,
    MenuItem } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Question from '../components/addQuestion';
import axios from 'axios';
import * as Evaluation from '../axois/evaluation';
import { observable, decorate } from 'mobx';
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
              display: 'flex',
              flexWrap: 'wrap',
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

        return (
            <Container maxWidth="md" minwidth="sm">
                <form className={useStyles.container} noValidate autoComplete="off" onSubmit={() => this.handleSubmit()} >
                    {/* Title */}
                    <div >
                        <TextField
                        id="standard-basic"
                        label="Evaluation Title"
                        margin="normal"
                        fullWidth
                        onChange={(event) => this.titleChange(event)}
                        value={this.state.title}
                        />
                    </div>

                    {/* Type */}
                    <div>
                    <FormControl fullWidth>
                        <InputLabel id="type">Type</InputLabel>
                        <Select
                        labelId="type"
                        value={this.state.eval_type}
                        onChange={(event) => this.typeChange(event)}
                        >
                            <MenuItem value="student_eval">Student Evaluation</MenuItem>
                            <MenuItem value="student_onsite_eval">Student On-Site Evaluation</MenuItem>
                            <MenuItem value="internship_eval">Internship Evaluation</MenuItem>
                            <MenuItem value="portfolio_eval">Portfolio Evaluation</MenuItem>
                        </Select>
                    </FormControl>
                    </div>

                    {/* Year */}
                    <div>
                        <TextField
                        id="standard-basic"
                        label="Year"
                        margin="normal"
                        fullWidth
                        onChange={(event) => this.yearChange(event)}
                        value={this.state.year}
                        />
                    </div>

                    {/* Version */}
                    <div>
                        <TextField
                        id="standard-basic"
                        label="Version"
                        margin="normal"
                        fullWidth
                        value={this.state.version}
                        readOnly
                        disabled
                        />
                    </div>

                    <hr></hr>
                    {/* The real meat and potatoes of the builder */}
                    {renderQuestions}
                    <Button variant="outlined" color="primary" type="button" onClick={() => this.addQuestion()}>
                        Add Question
                    </Button>
                    <br></br>


                    {/* Submit */}
                    <Button variant="outlined" color="primary" type="submit">
                        Create Evaluation
                    </Button>
                </form>
            </Container>
        );
    }
})

export default CreateEvaluation