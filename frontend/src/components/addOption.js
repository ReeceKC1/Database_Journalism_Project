import { Paper, TextField } from '@material-ui/core/';
import { observer } from 'mobx-react';
import React from 'react';

const Option = observer(class Option extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            option_text: '', 
            option_label: '',
        };
    }

    // Loading in data
    componentDidMount() {
        if(this.props.value !== null) {
            if(this.props.value.option_weight !== undefined) {
                this.setState({id: Number(this.props.value.option_weight)});
                this.setState({option_label: 'Option ' + (Number(this.props.value.option_weight) + 1)});
                this.setState({option_text: this.props.value.option_text});
            } else {
                this.setState({id: this.props.value.id});
                this.setState({option_label: 'Option ' + (this.props.value.id + 1)});
                this.setState({option_text: this.props.value.option_text});
            }
        }
          
    }

    // Handles with the drag change
    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props !== prevProps) {
            if(this.props.value.option_weight !== undefined) {
                this.setState({id: Number(this.props.value.option_weight)});
                this.setState({option_label: 'Option ' + (Number(this.props.value.option_weight) + 1)});
                this.setState({option_text: this.props.value.option_text});
            } else {
                this.setState({id: this.props.value.id});
                this.setState({option_label: 'Option ' + (this.props.value.id + 1)});
                this.setState({option_text: this.props.value.option_text});
            }
            
        }
      }

    changeOptionText = (event) => {
        let value = event.target.value;
        let questionID = this.props.questionID;

        this.setState({ option_text: value });
        this.props.createEvaluationState.questions[questionID].options[this.state.id].option_text = value;
        // this.props.value.option_text = value;
        // this.notifyParentOnChange(value);
    };

    render() {
        return (
                <Paper style={{width: '80%', marginRight: '5%', float: 'right'}}>
                        <TextField
                        id="standard-basic"
                        label={this.state.option_label}
                        margin="normal"
                        onChange={(event) => this.changeOptionText(event)}
                        autoFocus
                        style={{width: '96%', marginLeft: '2%', marginBottom: '20px'}}
                        value={this.state.option_text}
                        />
                </Paper>
        );
    };
})

export default Option