import React from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select,
    MenuItem } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Question from '../components/addQuestion';

export default class CreateEvaluation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            type: '',
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

    componentDidMount() {

    }

    // Functions to change state
    titleChange = (event) => {
        let value = event.target.value;
        this.setState({ title: value });
    };

    typeChange = (event) => {
        let value = event.target.value;
        this.setState({ type: value });
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
        questionNdx.question = question.question;
        questionNdx.options = question.options;

        this.setState({ questions: questions });
    };

    // Add a question
    addQuestion = () => {
        let templateQuestion = {
            id: this.state.questions.length,
            label: '',
            question: '',
            options: [], 
        }

        let questions = this.state.questions;
        questions.push(templateQuestion);

        this.setState({ questions: questions});
    };


    // Handle Submit will format data properly
    handleSubmit = (event) => {
        console.log('I am submitting');
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
            <Container maxWidth="sm">
                <form className={useStyles.container} noValidate autoComplete="off" onSubmit={this.handleSubmit} >
                    {/* Title */}
                    <div >
                        <TextField
                        id="standard-basic"
                        label="Evaluation Title"
                        margin="normal"
                        fullWidth
                        onChange={(event) => this.titleChange(event)}
                        />
                    </div>

                    {/* Type */}
                    <div>
                    <FormControl fullWidth>
                        <InputLabel id="type">Type</InputLabel>
                        <Select
                        labelId="type"
                        value={this.state.type}
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