import React from 'react';
import { Container, TextField, Button, FormControl, InputLabel, Select,
    MenuItem } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

export default class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            num: 0,
            label: '',
            question: '',
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
            question: question.question,
            options: question.options
        });
    }

    // Functions to set state
    changeLabel = (event) => {
        let value = event.target.value;
        this.setState({label: value});
        console.log('Change Label', value);
        // this.notifyParentOnChange();
    };

    changeQuestion = (event) => {
        let value = event.target.value;
        
        this.setState({question: value});
        // this.notifyParentOnChange();
    };

    // Let the parent know the questions info on change
    notifyParentOnChange = () => {
        let question = {
            id: this.state.num,
            label: this.state.label,
            question: this.state.question,
            options: this.state.options
        };

        console.log('tyring to change', question);
        
        this.props.updateQuestion(question);
    }

    render() {
        return (
            <div>
                <Container maxWidth="sm" style={{backgroundColor: '#cfe8fc', marginBottom: '20px'}}>
                    {/* Question Number */}
                    <small>Question: {this.state.num}</small>

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
                </Container>
            </div>
        );
    }
}