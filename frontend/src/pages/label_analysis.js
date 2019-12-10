import React from 'react';
import { Container, MenuItem, InputLabel, TextField, Grid, FormControl, Button, FormHelperText
} from '@material-ui/core/';
import {Redirect} from 'react-router-dom';

export default class LabelAnalysis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: null,
            year: null,
            label: null,
            end_year: null
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

        // Just trying to store the appropriate values in the state
        if(label === null && endYear === null) {
            // console.log(type[1], year[1], label, endYear);
            this.setState({
                type: type[1],
                year: year[1],
            });
        }
         else if(label === null) {
            // console.log(type[1], year[1], label, endYear[1]);
            this.setState({
                type: type[1],
                year: year[1],
                end_year: endYear[1],
            });
        } else if(endYear === null) {
            // console.log(type[1], year[1], label[1], endYear);
            this.setState({
                type: type[1],
                year: year[1],
                label: label[1],
            });
        } else {
            // console.log(type[1], year[1], label[1], endYear[1]);
            this.setState({
                type: type[1],
                year: year[1],
                label: label[1],
                end_year: endYear[1],
            });
        }
    }

    render() {
        return (
            <Container maxWidth="md" minwidth="sm" style={{marginTop: '75px'}}>
                This is the new page
            </Container>
        );
    }
}
