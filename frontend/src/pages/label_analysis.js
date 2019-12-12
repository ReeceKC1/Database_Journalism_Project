import React from 'react';
import { Container, Paper, Typography, TextField, Grid, FormControl, Button, FormHelperText
} from '@material-ui/core/';
import * as Answers from '../axois/answer';
import {PieChart, Pie, Sector} from 'recharts';
import LabelAnalysisForm from '../components/home/labelAnalysis';

export default class LabelAnalysis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: null,
            year: null,
            label: null,
            end_year: null,
            data: [],
            noLabel_data: [],
            noLabel_activeIndex: [],
            activeIndex: 0
        };
    }

    // Need to parse through the url to get each value
    componentDidMount() {
        var search = this.props.location.search;
        var typeRegex = 'type=(.+)&year';
        var yearRegexEnd = 'year=(.+)';
        var yearRegex = 'year=(.+?)&';
        var labelRegexEnd = 'label=(.+)';
        var labelRegex = 'label=(.+)&';
        var endYearRegex = 'end_year=(.+)';

        var type = search.match(typeRegex);
        var year = search.match(yearRegex);
        if(year === null) {
            year = search.match(yearRegexEnd);
        }
        var label = search.match(labelRegex);
        if(label === null) {
            label = search.match(labelRegexEnd);
        }
        var endYear = search.match(endYearRegex);

        // If label and endYear are null
        if(label === null && endYear === null) {
            // console.log(type[1], year[1], label, endYear);
            this.setState({
                type: type[1],
                year: year[1],
            });

            Answers.getAnswersByQuestionEvalYear(type[1], year[1], year[1]).then(response => {
                // console.log(response.data);
                this.formatNoLabel(response.data);
            }).catch(err => console.log('Failed to get answers', err));
        }
        // If just the label is null
         else if(label === null) {
            // console.log(type[1], year[1], label, endYear[1]);
            this.setState({
                type: type[1],
                year: year[1],
                end_year: endYear[1],
            });

            Answers.getAnswersByQuestionEvalYear(type[1], year[1], endYear[1]).then(response => {
                // console.log(response.data);
                this.formatNoLabel(response.data);
            }).catch(err => console.log('Failed to get answers', err));
        } 
        // if just the endYear is null
        else if(endYear === null) {
            // console.log(type[1], year[1], label[1], endYear);
            this.setState({
                type: type[1],
                year: year[1],
                label: label[1],
            });

            Answers.getAnswersByQuestionLabelAndEvalYear(type[1], label[1], year[1], year[1])
                .then(response => {
                    // console.log(response.data);
                    this.formatSingleLabel(response.data);
                }).catch(err => console.log('Failed to get Answers', err));
        } 
        // All attributes are present
        else {
            // console.log(type[1], year[1], label[1], endYear[1]);
            this.setState({
                type: type[1],
                year: year[1],
                label: label[1],
                end_year: endYear[1],
            });

            Answers.getAnswersByQuestionLabelAndEvalYear(type[1], label[1], year[1], endYear[1])
                .then(response => {
                    // console.log(response.data);
                    this.formatSingleLabel(response.data);
                }).catch(err => console.log('Failed to get Answers', err));
        }
    }

    componentDidUpdate(prevProps) {
        if(this.props.location.search !== prevProps.location.search) {
            // Wipe the state
            this.setState({
                type: null,
                year: null,
                label: null,
                end_year: null,
            });

            var search = this.props.location.search;
            var typeRegex = 'type=(.+)&year';
            var yearRegexEnd = 'year=(.+)';
            var yearRegex = 'year=(.+?)&';
            var labelRegexEnd = 'label=(.+)';
            var labelRegex = 'label=(.+)&';
            var endYearRegex = 'end_year=(.+)';

            var type = search.match(typeRegex);
            var year = search.match(yearRegex);
            if(year === null) {
                year = search.match(yearRegexEnd);
            }
            var label = search.match(labelRegex);
            if(label === null) {
                label = search.match(labelRegexEnd);
            }
            var endYear = search.match(endYearRegex);

            // If label and endYear are null
            if(label === null && endYear === null) {
                // console.log(type[1], year[1], label, endYear);
                this.setState({
                    type: type[1],
                    year: year[1],
                    noLabel_data: []
                });

                Answers.getAnswersByQuestionEvalYear(type[1], year[1], year[1]).then(response => {
                    // console.log(response.data);
                    this.formatNoLabel(response.data);
                }).catch(err => console.log('Failed to get answers', err));
            }
            // If just the label is null
            else if(label === null) {
                // console.log(type[1], year[1], label, endYear[1]);
                this.setState({
                    type: type[1],
                    year: year[1],
                    end_year: endYear[1],
                    noLabel_data: []
                });

                Answers.getAnswersByQuestionEvalYear(type[1], year[1], endYear[1]).then(response => {
                    // console.log(response.data);
                    this.formatNoLabel(response.data);
                }).catch(err => console.log('Failed to get answers', err));
            } 
            // if just the endYear is null
            else if(endYear === null) {
                // console.log(type[1], year[1], label[1], endYear);
                this.setState({
                    type: type[1],
                    year: year[1],
                    label: label[1],
                    data: []
                });

                Answers.getAnswersByQuestionLabelAndEvalYear(type[1], label[1], year[1], year[1])
                    .then(response => {
                        // console.log(response.data);
                        this.formatSingleLabel(response.data);
                    }).catch(err => console.log('Failed to get Answers', err));
            } 
            // All attributes are present
            else {
                // console.log(type[1], year[1], label[1], endYear[1]);
                this.setState({
                    type: type[1],
                    year: year[1],
                    label: label[1],
                    end_year: endYear[1],
                    data: []
                });

                Answers.getAnswersByQuestionLabelAndEvalYear(type[1], label[1], year[1], endYear[1])
                    .then(response => {
                        // console.log(response.data);
                        this.formatSingleLabel(response.data);
                    }).catch(err => console.log('Failed to get Answers', err));
            }
        }
    }


    // Going through a single labels data and formatting it
    formatSingleLabel = (data) => {
        var newData = new Map();

        for(var i = 0; i < data.length; i++) {
            var question = data[i];
            for(var j = 0; j < question.answers.length; j++) {
                var answer = question.answers[j];

                if(newData.has(answer.option_text)) {
                    newData.get(answer.option_text).count++;
                } else {
                    newData.set(answer.option_text, {count: 1});
                }
            }
        }

        console.log(newData);
        newData.forEach(this.mapToState);
    };

    // Goes through a map and sets up the data for rendering a pie chart
    mapToState = (values, key) => {
        var obj = {};
        obj.name = key;
        obj.value = values.count;

        let data = this.state.data;
        data.push(obj);
        this.setState({data: data});
    }


    // Pie Functions
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

    // #################################################
    // Going through many labels data and formatting it
    // #################################################
    formatNoLabel = (data) => {
        var formattedData = [];

        for(var i = 0; i < data.length; i++) {
            var question = data[i];

            // Check if it doesn't already exist in the array
            var foundNdx = formattedData.findIndex(x => x.label === question.label);

            // If it is in the index then get value and get its map
            if(foundNdx > -1) {
                var map = formattedData[foundNdx].map;
                for(var j = 0; j < question.answers.length; j++) {
                    var answer = question.answers[j];

                    if(map.has(answer.option_text)) {
                        map.get(answer.option_text).count++;
                    } else {
                        map.set(answer.option_text, {count: 1});
                    }
                }

            } 
            
            // Add new map to the array
            else {
                var map = new Map();
                for(var j = 0; j < question.answers.length; j++) {
                    var answer = question.answers[j];

                    if(map.has(answer.option_text)) {
                        map.get(answer.option_text).count++;
                    } else {
                        map.set(answer.option_text, {count: 1});
                    }
                }

                formattedData.push({label: question.label, map: map});
            }
        }

        // Go through each object and convert map to array of objects
        for(var i = 0; i < formattedData.length; i++) {
            var obj = formattedData[i];
            var newData = {name: obj.label, id: i};
            var dataArr = [];
            var mapIter = obj.map.entries();

            for(var j = 0; j < obj.map.size; j++) {
                var mapItem = mapIter.next().value;
                var dataPoint = {
                    name: mapItem[0], 
                    value: mapItem[1].count
                };

                // console.log(dataPoint);
                dataArr.push(dataPoint);
            }

            newData.data = dataArr;

            // Add it to the state
            var newState = this.state.noLabel_data;
            var activeIndexState = this.state.noLabel_activeIndex;
            newState.push(newData);
            activeIndexState.push(0);
            this.setState({
                noLabel_data: newState,
                noLabel_activeIndex: activeIndexState
            });
        }
        
    }

    render() {

        // Pie Function

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

        if(this.state.label !== null) {
            return (
                <Container maxWidth="md" minwidth="sm" style={{marginTop: '75px'}}>

                    {/* Search Bar */}
                    <div style={{marginBottom: '50px', marginLeft: '100px'}}>
                        <LabelAnalysisForm 
                            label={this.state.label}
                            eval_type={this.state.type}
                            year={this.state.year}
                            end_year={this.state.end_year}
                        />
                    </div>

                    <Paper style={{padding: '10px'}}>
                        <Typography variant="h5">Label: {this.state.label}</Typography>
                        <Typography variant="h5">From: {this.state.year} - {this.state.end_year}</Typography>
    
                        {/* Pie Chart */}
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                            >
                                <Grid item xs={12}>
                                {this.state.data.length !== 0 &&
                                    <PieChart width={500} height={400}>
                                        
                                            <Pie 
                                                activeIndex={this.state.activeIndex}
                                                activeShape={renderActiveShape} 
                                                data={this.state.data}
                                                isAnimationActive={false}
                                                innerRadius={100}
                                                outerRadius={120} 
                                                fill="#3f51b5"
                                                onMouseEnter={this.onPieEnter}
                                            />
                                        
                                    </PieChart>
                                }

                                {this.state.data.length === 0 &&
                                    <Typography variant='h5' centered>
                                        No Data Found!
                                    </Typography>
                                }

                                </Grid>
    
                            </Grid>
                    </Paper>
                </Container>
            );
        } 

        else {
            return (
                <Container maxWidth="md" minwidth="sm" style={{marginTop: '75px'}}>
                    {/* Search Bar */}
                    <div style={{marginBottom: '50px', marginLeft: '100px'}}>
                        <LabelAnalysisForm 
                            label={this.state.label}
                            eval_type={this.state.type}
                            year={this.state.year}
                            end_year={this.state.end_year}
                        />
                    </div>

                    {this.state.noLabel_data.map(data => 
                        <Paper style={{padding: '10px', marginBottom: '15px'}} key={data.id}>
                        <Typography variant="h5">Label: {data.name}</Typography>
                        <Typography variant="h5">From: {this.state.year} - {this.state.end_year}</Typography>
    
                        {/* Pie Chart */}
                        <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                            >
                                <Grid item xs={12}>
                                {data.data.length !== 0 &&
                                    <PieChart width={500} height={400}>
                                        
                                            <Pie 
                                                activeIndex={this.state.activeIndex}
                                                activeShape={renderActiveShape} 
                                                data={data.data}
                                                isAnimationActive={false}
                                                innerRadius={100}
                                                outerRadius={120} 
                                                fill="#3f51b5"
                                                onMouseEnter={this.onPieEnter}
                                            />
                                        
                                    </PieChart>
                                }

                                {data.data.length === 0 &&
                                    <Typography variant='h5' centered>
                                        No Data Found!
                                    </Typography>
                                }
                                </Grid>
    
                            </Grid>
                    </Paper>
                        
                    )}
                </Container>
            );
        }

        
    }
}
