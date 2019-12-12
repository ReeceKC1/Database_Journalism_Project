import { Grid, TextField, Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React from 'react';
import { observer } from '../../node_modules/mobx-react/dist/mobx-react';
import { decorate, observable } from '../../node_modules/mobx/lib/mobx';

const BuildEvaluation = observer(class BuildEvaluation extends React.Component {
    evaluation = this.props.viewEvaluationState.evaluation

    constructor(props) {
        super(props);
        this.state = {
            radio_values: []
        }
        decorate(this.state, {
            radio_values: observable
        })

        for(let i = 0; i < this.evaluation.questions.length; i++) {
            this.state.radio_values.push('')
            this.props.viewEvaluationState.answers.push({
                question_id: this.evaluation.questions[i].question_id,
                option_text: '',
                comment_text: '',
            })
        }

    }

    componentDidMount() {}

    buildOptions = (question) => {
        let options = []
        for (let i = 0; i < question.options.length; i++) {
            options.push(
                <div key={i}>
                    <FormControlLabel value={question.options[i].option_text} style={{marginLeft: '5%'}} control={<Radio />} label={question.options[i].option_text} />
                </div>
            )
        }
        return(
            <div>
                {options}
            </div>
        )
    }

    updateValue = (value, i) => {
        let values = value
        this.state.radio_values[i] = values
        this.props.viewEvaluationState.answers[i].option_text = value
    }   

    buildQuestions = () => {
        let questions = []
        for(let i = 0; i < this.evaluation.questions.length; i++) {
            questions.push(
                <div key={i} style={{width: '100%', padding: '10px'}}>
                    <Typography variant="h5">
                        {this.evaluation.questions[i].question_text}
                    </Typography>
                    <Grid container spacing={1} direction = "column" key={i}>
                        <Grid item style={{width: '100%'}}>
                        <FormControl component="fieldset" style={{width: '100%'}}>
                            <RadioGroup value={this.state.radio_values[i]} onChange={(event) => {this.updateValue(event.target.value, i)}}>
                                {this.buildOptions(this.evaluation.questions[i])}
                            </RadioGroup>
                        </FormControl>
                        </Grid>
                        {this.evaluation.eval_type === 'portfolio_eval' &&
                        <Grid item>
                            <TextField
                            label="Comments"
                            multiline
                            InputProps={this.props.viewEvaluationState.readOnly}
                            rows="5"
                            variant="outlined"
                            style={{marginLeft: '5%', width: '90%'}}
                            onChange={(event) => {this.props.viewEvaluationState.answers[i].comment_text = event.target.value}}
                            />
                        </Grid>
                        }
                    </Grid>
                </div>
            )
        }
        return(
            <div>
                {questions}
            </div>
        )
    }

    render() {
        return (
            <div style = {{width: '100%'}}>
                {this.buildQuestions()}
                {this.evaluation.eval_type !== 'portfolio_eval' &&
                    <TextField
                    label="Comments"
                    multiline
                    InputProps={this.props.viewEvaluationState.readOnly}
                    rows="5"
                    margin="normal"
                    variant="outlined"
                    onChange={(event) => {this.props.viewEvaluationState.eval_comment = event.target.value}}
                    style={{ width: '100%'}}
                    />}
            </div>
        );
    }
})

export default BuildEvaluation