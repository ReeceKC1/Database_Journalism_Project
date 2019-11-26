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
        this.setState({id: this.props.id});
        this.setState({option_label: 'Option ' + (this.props.id + 1)}) 

        if(this.props.value != undefined) {
            this.setState({option_text: this.props.value});
        } else {
            this.setState({option_text: ''});
        }
          
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props !== prevProps) {
          this.setState({option_text: this.props.value});
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