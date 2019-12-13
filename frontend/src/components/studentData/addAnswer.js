import { Grid, Paper, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react';

const AddAnswer = observer(class AddAnswer extends React.Component {
    buildAnswers = () => {
        let answers = []
        for(let j = 0; j < this.props.questions.length; j++){
            for (let i = 0; i < this.props.answer.answers.length; i++) {
                if (this.props.questions[j].question_id === this.props.answer.answers[i].question_id){
                    answers.push(
                        <Paper key={i} style={{padding: '5px', width: '100%', marginBottom: '5px'}}>
                            <Typography variant='h6'>
                                {this.props.questions[j].question_text}
                            </Typography>
                            <Typography style={{marginLeft: '20px'}}>
                                > {this.props.answer.answers[i].option_text}
                            </Typography>
                            {this.props.answer.eval_type === 'portfolio_eval' &&
                            <Typography style={{marginLeft: '20px'}}>
                                > {this.props.answer.answers[i].comment_text.comment_text}
                            </Typography>
                            }
                        </Paper>
                    )
                }
            }
        }
        return answers
    }

    render() {
        return(
            <div style={{width: '100%'}}>
                <Paper style={{width: '100%', marginBottom: '5px', padding: '5px', backgroundColor: '#cfe8fc'}}>
                    {this.props.answer.eval_type === 'portfolio_eval' &&
                    <Typography variant='h6'>
                        Reviewed by {this.props.answer.reviewer_name}
                    </Typography>
                    }
                    {this.props.answer.eval_type !== 'portfolio_eval' &&
                    <div>
                    <Typography variant='h6'>
                        {this.props.answer.supervisor.name}
                    </Typography>
                    <Typography variant='h6'>
                        From {this.props.answer.company.company_name}
                    </Typography>
                    </div>
                    }
                    {this.buildAnswers()}
                    {this.props.answer.eval_type !== 'portfolio_eval' &&
                    <Typography>
                        > {this.props.answer.comment_text}
                    </Typography>
                    }
                </Paper>
            </div>
        )
    }
})

export default AddAnswer