import React from 'react';
import { Container, Table, TableHead, TableRow, TableCell, TableBody,
    Button } from '@material-ui/core/';
import axios from 'axios';
import StudentEvalStatic from '../components/static/studentEvalStatic';
import InternshipEvalStatic from '../components/static/internshipEvalStatic';
import PortfolioEvalStatic from '../components/static/portfolioEvalStatic';

export default class ViewEvaluation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            evaluation: null,
            type: null,
            year: null
        };
    }

    // Make the call based on params
    componentDidMount() {
        if(this.props.location !== undefined) {
            let search = this.props.location.search
            var typePatt = "=(.+)&";
            var yearPatt = "year=(.+)"

            // Got Type and year from the url
            var type = search.match(typePatt)[1];
            var year = search.match(yearPatt)[1];
            // Setting it to the state
            this.setState({ type: type, year: year});
            
            
            const url = 'http://localhost:5000/api/evaluation/get?type='+ type + '&year=' + year;
            axios.get(url).then(response => {
                let data = response.data;
                console.log('Got Eval', response);

                this.setState({evaluation: data});
            }).catch(error => {
                console.log(error);
            });
        }
    }

    render() {
        if(this.state.evaluation != null) {
            return (
                <Container maxWidth="md" minwidth="sm">
                    {JSON.stringify(this.state.evaluation)}
                    <br></br>
                    <br></br>

                    {/* Rendering the header */}
                    {this.state.type === 'student_eval' && 
                        <StudentEvalStatic/>
                    }

                    {this.state.type === 'student_onsite_eval' && 
                        <StudentEvalStatic/>
                    }

                    {this.state.type === 'internship_eval' && 
                        <InternshipEvalStatic/>
                    }
                    
                    {this.state.type === 'portfolio_eval' && 
                        <PortfolioEvalStatic/>
                    }
                    
                </Container>
            );
        } else {
            return (
                <Container maxWidth="md" minwidth="sm">
                    No Data Found!
                </Container>
            );
        }
        
    }
}