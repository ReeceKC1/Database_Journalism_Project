import React from 'react';
import { Grid, TextField } from '@material-ui/core/';

export default class Option extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            option_text: '', 
            option_label: 'Option 1',
        };
    }

    // Loading in data
    componentDidMount() {
        if(this.props.value != null) {
            if(this.props.value.option_weight != undefined) {
                this.setState({id: Number(this.props.value.option_weight)});
                this.setState({option_label: 'Option ' + (this.props.value.id + 1)});
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
            if(this.props.value.option_weight != undefined) {
                this.setState({id: Number(this.props.value.option_weight)});
                this.setState({option_label: 'Option ' + (this.props.value.id + 1)});
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

        this.setState({ option_text: value });
        this.notifyParentOnChange(value);
    };

    notifyParentOnChange = (value) => {
        let option = {
            id: this.state.id,
            option_text: value
        };

        this.props.optionTextChange(option);
    };

    render() {
        return (
            <Grid container justify="center" >
                <Grid item xs={8} style={{backgroundColor: '#efefef', marginBottom: '20px'}}>
                    {/* Question Number */}
                    <small>Option: {this.state.id}</small>

                    {/* Question Label */}
                    <div >
                            <TextField
                            id="standard-basic"
                            label={this.state.option_label}
                            margin="normal"
                            fullWidth
                            onChange={(event) => this.changeOptionText(event)}
                            autoFocus 
                            value={this.state.option_text}
                            />
                        </div>
                </Grid>
            </Grid>
        );
    };
}