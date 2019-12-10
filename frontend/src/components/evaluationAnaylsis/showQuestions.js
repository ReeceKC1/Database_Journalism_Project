import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography, Grid, Paper 
} from '@material-ui/core/';
import * as Answers from '../../axois/answer';
import {PieChart, Pie, Sector} from 'recharts';

export default class ShowQuestion extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question: null,
            activeIndex: 0
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

    getInitialState = () => {
        return {
          activeIndex: 0,
        };
      }
    
      onPieEnter = (data, index) => {
        this.setState({
          activeIndex: index,
        });
      }

    render() {

        if(this.state.question !== null) {
            const options = this.state.question.options;
            const q = this.state.question;

            // const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
            //       {name: 'Group C', value: 300}, {name: 'Group D', value: 200}];

            const data = [];

            for(var i = 0; i < options.length; i++) {
                let option = options[i];
                var dataPoint = {};
                dataPoint.name = option.option_text;
                dataPoint.value = option.count;

                data.push(dataPoint);
            }

            const renderActiveShape = (props) => {
                const RADIAN = Math.PI / 180;
                const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
                  fill, payload, percent, value } = props;
                const sin = Math.sin(-RADIAN * midAngle);
                const cos = Math.cos(-RADIAN * midAngle);
                const sx = cx + (outerRadius + 10) * cos;
                const sy = cy + (outerRadius + 10) * sin;
                const mx = cx + (outerRadius + 30) * cos;
                const my = cy + (outerRadius + 30) * sin;
                const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                const ey = my;
                const textAnchor = cos >= 0 ? 'start' : 'end';
              
                return (
                  <g>
                    <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
                    <Sector
                      cx={cx}
                      cy={cy}
                      innerRadius={innerRadius}
                      outerRadius={outerRadius}
                      startAngle={startAngle}
                      endAngle={endAngle}
                      fill={fill}
                    />
                    <Sector
                      cx={cx}
                      cy={cy}
                      startAngle={startAngle}
                      endAngle={endAngle}
                      innerRadius={outerRadius + 6}
                      outerRadius={outerRadius + 10}
                      fill={fill}
                    />
                    <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
                    <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} Selected`}</text>
                    <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                      {`(${(percent * 100).toFixed(2)}%)`}
                    </text>
                  </g>
                );
              };

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
                                        <TableCell>{((option.count / this.state.question.total_count) * 100).toFixed(2) + '%'}</TableCell>
                                        <TableCell>{option.count}</TableCell>
                                        <TableCell>{this.state.question.total_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pie Chart */}
                        <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        >
                            <Grid item xs={12}>
                                <PieChart width={600} height={400}>
                                    <Pie 
                                        activeIndex={this.state.activeIndex}
                                        activeShape={renderActiveShape} 
                                        data={data} 
                                        cx={300} 
                                        cy={200} 
                                        innerRadius={60}
                                        outerRadius={80} 
                                        fill="#3f51b5"
                                        onMouseEnter={this.onPieEnter}
                                    />
                                </PieChart>
                            </Grid>

                        </Grid>
    
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