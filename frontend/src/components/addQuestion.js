import React from 'react';
import { Grid, TextField, Button} from '@material-ui/core/';
import Option from '../components/addOption';
import ReactDragListView from 'react-drag-listview';

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
            question_text: question.question_text,
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

    addAvg = () => {
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
        this.notifyParentOnChange('options', options);
    };

    addAgree = () => {
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
        this.notifyParentOnChange('options', options);
    }

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
        if(option === 'label') {
            question = {
                id: this.state.num,
                label: value,
                question_text: this.state.question_text,
                options: this.state.options
            };
        } else if(option === 'question') {
            question = {
                id: this.state.num,
                label: this.state.label,
                question_text: value,
                options: this.state.options
            };
        } else if(option === 'options') {
            question = {
                id: this.state.num,
                label: this.state.label,
                question_text: this.state.question_text,
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

    render() {
        const renderOptions = this.state.options.map((option) => 
            <div key={option.id}>
                <Option id={option.id} 
                value={option.option_text}
                optionTextChange={(value) => this.optionChange(value)}
                />
            </div>
        );

        // Sortable option list
        const that = this;
        const dragProps = {
            onDragEnd(fromIndex, toIndex) {
                const options = that.state.options;
                const item = options.splice(fromIndex, 1)[0];
                options.splice(toIndex, 0, item);

                for(var i = 0; i < options.length; i++) {
                    options[i].id = i;
                }
                that.setState({ options });
            }, 
            nodeSelector: 'div',
            handleSelector: 'a'
        };

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
                            {this.state.options.map((option) => ( 
                                <div key={option.id}>
                                    {/* Need to keep this drag element */}
                                    <a href="#">Drag</a>
                                    <Option id={option.id} 
                                    value={option.option_text}
                                    optionTextChange={(value) => this.optionChange(value)}
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
}