import React from 'react';
import { Typography, ExpansionPanel, ExpansionPanelSummary,
    ExpansionPanelDetails, Grid,
} from '@material-ui/core/';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShowQuestion from './showQuestions';

export default class EvalExpansionPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        const evl = this.props.evaluation;

        return (
            <ExpansionPanel style={{backgroundColor: '#3f51b5', color: 'white'}}>
                {/* Header */}
                <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon style={{ color: 'white' }}/>}
                aria-controls={evl.eval_type + evl.year + '-content'}
                id={evl.eval_type + evl.year + '-header'}
                >
                    <Typography>{evl.eval_type} {evl.year}</Typography>
                </ExpansionPanelSummary>
                {/* Details */}
                <ExpansionPanelDetails>
                    <Grid container spacing={3}>
                        {/* Where Each Question will Go */}
                        {evl.questions.map((question) => 
                            <ShowQuestion
                                key={question.order_value}
                                question={question}
                            />
                        )}
                    </Grid>
                    {/* <ShowQuestion></ShowQuestion> */}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }
}