import React from 'react';
import { Grid, TextField, Button} from '@material-ui/core/';
import Option from '../components/addOption';
import ReactDragListView from 'react-drag-listview';
import { observer } from 'mobx-react';

const Question = observer(class Question extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            label: '',
            question_text: '',
            options: [], 
        };
    }

    componentDidMount() {
        // console.log("I got question",this.props.question);
        let question = this.props.question;
        let ndx = this.props.question.id;
        let mobxQuestion = this.props.createEvaluationState.questions[ndx];
        // console.log(mobxQuestion);
        this.setState({question: question});

        // Setting values in the question
        this.setState({
            id: question.id,
            label: question.label,
            question_text: question.question_text,
            options: question.options
        });
    }

    // Functions to set state
    changeLabel = (event) => {
        let value = event.target.value;
        let ndx = this.state.id;
        this.setState({label: value});
        
        this.props.createEvaluationState.questions[ndx].label = value;
    };

    changeQuestion = (event) => {
        let value = event.target.value;
        let ndx = this.state.id;        
        this.setState({question_text: value});
        
        this.props.createEvaluationState.questions[ndx].question_text = value;
    };

    addAvg = () => {
        let ndx = this.state.id;
        let options = [
            {
                id: 0,
                option_text: 'Above Average', 
                option_label: 'Option 1',
            },
            {
                id: 1,
                option_text: 'Average', 
                option_label: 'Option 2',
            },
            {
                id: 2,
                option_text: 'Below Average', 
                option_label: 'Option 3',
            }
        ];

        this.setState({options: options});
        this.props.createEvaluationState.questions[ndx].options = options;
    };

    addAgree = () => {
        let ndx = this.state.id;
        let options = [
            {
                id: 0,
                option_text: 'Strongly Agree', 
                option_label: 'Option 1',
            },
            {
                id: 1,
                option_text: 'Somewhat Agree', 
                option_label: 'Option 2',
            },
            {
                id: 2,
                option_text: 'Neither Agree nor Disagree', 
                option_label: 'Option 3',
            },
            {
                id: 3,
                option_text: 'Somewhat Disagree', 
                option_label: 'Option 4',
            },
            {
                id: 4,
                option_text: 'Strongly Disagree', 
                option_label: 'Option 5',
            },
        ];

        this.setState({options: options});
        this.props.createEvaluationState.questions[ndx].options = options;
    }

    // Add new option
    addOption = () => {
        let ndx = this.state.id;
        let options = this.props.createEvaluationState.questions[ndx].options;
        let option = {
            id: options.length,
            option_text: ''
        };

        options.push(option);

        this.setState({options: options});
        this.props.createEvaluationState.questions[ndx].options = options;
    };

    render() {
        // Sortable option list
        const that = this;
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                const options = that.props.question.options;
                const item = options.splice(fromIndex, 1)[0];
                options.splice(toIndex, 0, item);
                console.log("I am trying to update shit");

                // for(var i = 0; i < options.length; i++) {
                //     options[i].id = i;
                // }
                // that.setState({ options });
                that.props.question.options = options;
            }, 
            nodeSelector: 'div',
            handleSelector: 'a'
        };

        return (
            <div>
                <Grid container style={{backgroundColor: '#cfe8fc', marginBottom: '20px'}}>
                    <Grid item xs={12}>
                        {/* Question Number */}
                        <small>question_text: {this.state.id}</small>

                        {/* Question Label */}
                        <div >
                                <TextField
                                id="standard-basic"
                                label="Question Label"
                                margin="normal"
                                fullWidth
                                onChange={(event) => this.changeLabel(event)}
                                value={this.state.label}
                                autoFocus 
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
                            value={this.state.question_text}
                        />
                        </div>

                        {/* Options */}
                        <hr></hr>

                        {/* Button to add defaults */}
                        <Button variant="outlined" color="primary" type="button" onClick={() => this.addAvg()}>
                            Avg Set
                        </Button>

                        <Button variant="outlined" color="primary" type="button" onClick={() => this.addAgree()}>
                            Agree Set
                        </Button>


                        {/* {renderOptions} */}
                        <ReactDragListView {...dragProps}>
                            {this.props.question.options.map((option) => ( 
                                <div key={option.id}>
                                    {/* Need to keep this drag element */}
                                    <a href="#">Drag</a>
                                    <Option id={option.id} 
                                    value={option}
                                    questionID={this.state.id}
                                    createEvaluationState={this.props.createEvaluationState}
                                    />
                            </div>))}
                        </ReactDragListView>
                        <Button variant="outlined" color="primary" type="button" onClick={() => this.addOption()}>
                            Add Option
                        </Button>
                        <br></br>

                    </Grid>
                </Grid>
            </div>
        );
    }
})

export default Question