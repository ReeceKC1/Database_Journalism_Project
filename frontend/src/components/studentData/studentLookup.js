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
        var students = await axios.get(`http://localhost:5000/api/student/check/${this.studentLookupState.id}`).catch((error) => {
            this.studentLookupState.students = []
        })
        if (students){
            this.studentLookupState.students = students.data
        }
    }

    makeStudentButtons = () => {
        let buttons = []
        for (let i = 0; i < this.studentLookupState.students.length; i++) {
            buttons.push(
                <Button 
                    key={i}
                    variant="outlined" 
                    color="primary"
                    style={{width: '100%', marginBottom: '5px'}}
                    component={Link}
                    to={{
                        pathname: "/student-info",
                        search: "?id=" + this.studentLookupState.students[i].student_id
                    }}
                >
                    {this.studentLookupState.students[i].first_name} {this.studentLookupState.students[i].last_name} {this.studentLookupState.students[i].student_id}
                </Button>
            )
        }
        return buttons
    }

    render() {
        return(
          <div style={{height: '100%', width: '100%'}}>
              <TextField
              style={{width: 'calc(100% - 95px)'}}
              label="ID or Name"
                onChange={(e) => {this.studentLookupState.id = e.target.value}}
              />
              <Button variant="outlined" color="primary" style={{marginLeft: '5px', marginTop: '12px'}}
              onClick={() => this.submit()}>
                Lookup
              </Button>
              <Paper style={{backgroundColor: '#cfe8fc', height: 'calc(100% - 90px)', width: '100%', marginTop: '10px', padding: '10px', overflow: 'auto'}}>
                {this.makeStudentButtons()}
              </Paper>
          </div>  
        )
    }
})

export default StudentLookup