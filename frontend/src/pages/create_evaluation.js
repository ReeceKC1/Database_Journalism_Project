import React from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select,
    MenuItem } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Question from '../components/addQuestion';
import axios from 'axios';
import * as Evaluation from '../axois/evaluation';

export default class CreateEvaluation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            eval_type: '',
            year: '',
            version: '1',
            questions: [
                // {
                //     id: 0,
                //     label: 'Q1',
                //     question: 'Question1',
                //     options: [], 
                // }
            ]
        };
    }

    // If data was passed in render it
    componentDidMount() {
        if(this.props.location !== undefined && this.props.location.state !== undefined && this.props.location.state.type !== null) {
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
    };

    typeChange = (event) => {
        let value = event.target.value;
        this.setState({ eval_type: value });
    };
    
    yearChange = (event) => {
        let value = event.target.value;
        this.setState({ year: value });
    };

    updateQuestion = (question) => {
        let ndx = question.id;
        let questions = this.state.questions;
        
        // Update the particular question data
        let questionNdx = questions[ndx];

        questionNdx.label = question.label;
        questionNdx.question_text = question.question_text;
        questionNdx.options = question.options;

        this.setState({ questions: questions });
    };

    // Add a question
    addQuestion = () => {
        let templateQuestion = {
            id: this.state.questions.length,
            label: '',
            question_text: '',
            options: [], 
        }

        let questions = this.state.questions;
        questions.push(templateQuestion);

        this.setState({ questions: questions});
    };


    // Handle Submit will format data properly
    handleSubmit = (event) => {
        console.log('I am submitting');
        
        // Need to go through each question and option to clean up data 
        // in case it has been imported
        // console.log(this.state);
        let payload = {
            title: this.state.title,
            eval_type: this.state.eval_type,
            year: this.state.year,
            version: this.state.version,
            questions: []
        };

        // Question / Option Data
        for(var i = 0; i < this.state.questions.length; i++) {
            let question = this.state.questions[i];

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
                        id: option.id,
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
          const renderQuestions = this.state.questions.map((question) => 
            <Question 
                question={question} 
                key={question.id}
                updateQuestion={(question) => this.updateQuestion(question)}
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
}