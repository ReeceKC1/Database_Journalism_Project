import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody,
    Button, Container, Typography, Grid, Paper 
} from '@material-ui/core/';
import * as Answers from '../../axois/answer';

export default class ShowQuestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question: null
        };
    }

    // Will probably need to go through the answers for each question
    componentDidMount() {
        if(this.props.question !== undefined) {
            var question = this.props.question;
            var answers;

            // Get all answers for this question
            Answers.getAnswersByQuestionId(question.question_id).then(response => {
                console.log(response.data);
                answers = response.data;

                // Setting total count for question
                question.total_count = answers.length;

                 // Setting answer count for each option
                for(let i = 0; i < question.options.length; i++) {
                    question.options[i].count = 0;
                }

                // Go through each answer and keep track of count
                for(let i = 0; i < answers.length; i++) {
                    var option = answers[i].option_text;

                    var ndx = question.options.findIndex(x => x.option_text === option);
                    question.options[ndx].count++;
                    
                } 

                console.log(question);
                this.setState({question: question});
            }).catch(error => console.log(error));

           
            
        }
    }

    render() {

        if(this.state.question !== null) {
            const options = this.state.question.options;
            const q = this.state.question;
            return (
                <Grid item xs={12}>
                    <Paper style={{ padding: '10px'}}>
                        {/* Question Text*/}
                        <Typography variant="h5">
                            Question {q.order_value}: {q.question_text} 
                        </Typography>
    
                        {/* Question Label */}
                        <Typography variant="h6">
                            Label: {q.label} 
                        </Typography>
    
                        {/* Table for options */}
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Option</TableCell>
                                    <TableCell>%</TableCell>
                                    <TableCell>Count</TableCell>
                                    <TableCell>Total Answer Count</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {options.map(option => (
                                    <TableRow key={option.option_text}>
                                        <TableCell>{option.option_text}</TableCell>
                                        <TableCell>{((option.count / this.state.question.total_count) * 100) + '%'}</TableCell>
                                        <TableCell>{option.count}</TableCell>
                                        <TableCell>{this.state.question.total_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
    
                    </Paper>
                </Grid>
            );
        } else {
            return (
                <div>
                    Loading...
                </div>
            );
        }
        
    }
}