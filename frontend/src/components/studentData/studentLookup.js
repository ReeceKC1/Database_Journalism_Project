import { Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, decorate } from 'mobx'
import axios from 'axios';
import {Link} from 'react-router-dom';

const StudentLookup = observer(class StudentLookup extends React.Component {
    studentLookupState = {}

    constructor(props){
        super(props);
        this.studentLookupState = {
            id: '',
            students: []
        }
        decorate(this.studentLookupState, {
            id: observable,
            students: observable,
        })
    }

    async submit() {
        var students = await axios.get(`http://localhost:5000/api/student/check/${this.studentLookupState.id}`)
        if (this.studentLookupState.validID){
            this.props.history.push(`/student-info?id=${this.studentLookupState.id}`)
        }
        this.studentLookupState.students = students.data
    }

    makeStudentButtons = () => {
        let buttons = []
        for (let i = 0; i < this.studentLookupState.students.length; i++) {
            buttons.push(
                <Button 
                    key={i}
                    variant="outlined" 
                    color="primary"
                    component={Link}
                    to={{
                        pathname: "/student-info",
                        search: "?id=" + this.studentLookupState.students[i].student_id
                    }}
                >
                    {this.studentLookupState.students[i].first_name} {this.studentLookupState.students[i].last_name}
                </Button>
            )
        }
        return buttons
    }

    render() {
        return(
          <div>
              <Typography>
                  Enter a Students Name or ID
              </Typography>
              <TextField
                onChange={(e) => {this.studentLookupState.id = e.target.value}}
              />
              <Button variant="outlined" color="primary"
              onClick={() => this.submit()}>
                Lookup
              </Button>
              <Paper>
                {this.makeStudentButtons()}
              </Paper>
          </div>  
        )
    }
})

export default StudentLookup