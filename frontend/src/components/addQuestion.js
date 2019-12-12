import React from 'react';
import { Grid, TextField, Button, Paper, Typography, IconButton } from '@material-ui/core/';
import Option from '../components/addOption';
import ReactDragListView from 'react-drag-listview';
import { observer } from 'mobx-react';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { toJS } from 'mobx';

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
        let value = event.target.value.toLowerCase();
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
    removeQuestion = () => {
        let id = this.state.id;
        let questions = this.props.createEvaluationState.questions;
        questions.splice(id,1);
        for (var i =id; i < questions.length; i++){
            (questions[i].id)--;
        }
        this.props.createEvaluationState.questions = questions;
        this.forceUpdate();
    };

    render() {
        // Sortable option list
        const that = this;
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                const options = that.props.createEvaluationState.questions[that.state.id].options;
                const item = options.splice(fromIndex, 1)[0];
                options.splice(toIndex, 0, item);
                for(var i = 0; i < options.length; i++) {// this is jank but it avoids having duplicate errors
                    options[i].id +=100;
                }
                for(var i = 0; i < options.length; i++) {
                    options[i].id = i;
                }
                // that.setState({ options });
                that.props.question.options = options;
                that.props.createEvaluationState.questions[that.state.id].options=options;
            }, 
            nodeSelector: 'div',
            handleSelector: 'a'
        };
        let style = {
            width: '90%',
            marginLeft: '5%',
        }
        let extraHeight = 0;
        if(window.innerWidth < 450 ){
            extraHeight = 100;
        }
        return (
             
                <Grid container spacing={1} direction = "column" >
                    <Paper style={{backgroundColor: '#cfe8fc', height: `calc((100px * ${this.props.question.options.length})+ ${extraHeight} + 380px)`, marginBottom: '20px', padding: '15px'}}>
                    {/* Question Number */}
                    
                    <Typography>
                        Question: {this.state.id + 1} 
                    </Typography>
                    <Button className ="float-right text-secondary" type="button" title= "Remove Question" onClick={() => this.removeQuestion()}>
                        X   
                    </Button>
                    {/* Question Label */}
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        id="standard-basic"
                        label="Question Label"
                        margin="normal"
                        style={style}
                        onChange={(event) => this.changeLabel(event)}
                        value={this.props.createEvaluationState.questions[this.state.id].label}
                        autoFocus 
                        />
                    </Grid>
                        {/* Question */}
                    <Grid item style = {{width: '100%'}}>
                        <TextField
                        id="standard-basic"
                        label="Question"
                        margin="normal"
                        style={style}
                        onChange={(event) => this.changeQuestion(event)}
                        value={this.props.createEvaluationState.questions[this.state.id].question_text }
                        />
                    </Grid>

                    {/* Options */}
                    <hr></hr>

                    {/* Button to add defaults */}
                    <Grid item style = {{width: '100%'}}>
                        <Typography>
                            Question Options
                        </Typography>

                        <Button style={{margin: '5px'}} variant="contained" color="primary" type="button" onClick={() => this.addOption()}>
                            Add Option
                        </Button>

                        <Button style={{margin: '5px'}} variant="contained" color="primary" type="button" onClick={() => this.addAvg()}>
                            Avg Set
                        </Button>
                    
                        <Button style={{margin: '5px'}} variant="contained" color="primary" type="button" onClick={() => this.addAgree()}>
                            Agree Set
                        </Button>
                    </Grid>

                    <hr></hr>

                    {/* {renderOptions} */}
                    <Grid item style={{width: '100%', height: `calc(100px * ${this.props.createEvaluationState.questions[this.state.id].options.length})`}}>
                    <ReactDragListView {...dragProps}>
                        {this.props.createEvaluationState.questions[this.state.id].options.map((option) => ( 
                            <div key={option.id} style={{padding: '8px', height: '100px', width: '100%',display: 'flex'}}>
                                {/* Need to keep this drag element */}
                                <IconButton variant="contained" color="primary" type="button" style={{margin: '4px', float: 'left'}}>
                                    <a href="#"><DragHandleIcon/></a>
                                </IconButton>
                                <Option id={option.id} 
                                value={option}
                                questionID={this.state.id}
                                createEvaluationState={this.props.createEvaluationState}
                                />
                        </div>))}
                    </ReactDragListView>
                    </Grid>
                    </Paper>
                </Grid>
        );
    }
})

export default Question