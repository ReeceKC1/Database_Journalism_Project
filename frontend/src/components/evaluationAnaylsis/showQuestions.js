import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody,
    Button, Container, Typography, Grid, Paper 
} from '@material-ui/core/';

export default class ShowQuestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    // Will probably need to go through the answers for each question
    componentDidMount() {
        
    }

    render() {
        const q = this.props.question;
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
                    
                </Paper>
            </Grid>
        );
    }
}