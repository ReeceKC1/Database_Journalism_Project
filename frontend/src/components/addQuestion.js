import React from 'react';
import { Grid, TextField, Button, FormControl, InputLabel, Select,
    MenuItem } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Option from '../components/addOption';

export default class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            num: 0,
            label: '',
            question_text: '',
            options: [], 
        };
    }

    componentDidMount() {
        console.log("I got question",this.props.question);
        let question = this.props.question;

        // Setting values in the question
        this.setState({
            num: question.id,
            label: question.label,
            question_text: question.question,
            options: question.options
        });
    }

    // Functions to set state
    changeLabel = (event) => {
        let value = event.target.value;
        this.setState({label: value});

        this.notifyParentOnChange('label', value);
    };

    changeQuestion = (event) => {
        let value = event.target.value;
        
        this.setState({question_text: value});
        this.notifyParentOnChange('question', value);
    };

    // TODO might want to change if 
    // I am going to be able to change option order
    optionChange = (value) => {
        let id = value.id;
        let options = this.state.options;
        let optionNdx = options[id];

        // Changing the option value
        optionNdx.option_text = value.option_text;

        this.setState({options: options});
        this.notifyParentOnChange('options', options);
    }

    // Let the parent know the questions info on change
    notifyParentOnChange = (option, value) => {
        let question;
        if(option == 'label') {
            question = {
                id: this.state.num,
                label: value,
                question_text: this.state.question,
                options: this.state.options
            };
        } else if(option == 'question') {
            question = {
                id: this.state.num,
                label: this.state.label,
                question_text: value,
                options: this.state.options
            };
        } else if(option == 'options') {
            question = {
                id: this.state.num,
                label: this.state.label,
                question_text: this.state.question,
                options: value
            };
        }
        

        // console.log('tyring to change', question);
        
        this.props.updateQuestion(question);
    }

    // Add new option
    addOption = () => {
        let options = this.state.options;
        let option = {
            id: this.state.options.length,
            option_text: ''
        };

        options.push(option);

        this.setState({options: options});
    };

    // Edit an option
    

    render() {
        const renderOptions = this.state.options.map((option) => 
            <div key={option.id}>
                <Option id={option.id} 
                optionTextChange={(value) => this.optionChange(value)}
                />
            </div>
        );

        return (
            <div>
                <Grid container style={{backgroundColor: '#cfe8fc', marginBottom: '20px'}}>
                    <Grid item xs={12}>
                        {/* Question Number */}
                        <small>question_text: {this.state.num}</small>

                        {/* Question Label */}
                        <div >
                                <TextField
                                id="standard-basic"
                                label="Question Label"
                                margin="normal"
                                fullWidth
                                onChange={(event) => this.changeLabel(event)}
                                />
                            </div>

                        {/* Question */}
                        <div >
                            <TextField
                            id="standard-basic"
                            label="Question"
                            margin="normal"
                            fullWidth
                            onChange={(event) => this.changeQuestion(event)}
                        />
                        </div>

                        {/* Options */}
                        <hr></hr>
                        {renderOptions}
                        <Button variant="outlined" color="primary" type="button" onClick={() => this.addOption()}>
                            Add Option
                        </Button>
                        <br></br>

                    </Grid>
                </Grid>
            </div>
        );
    }
}