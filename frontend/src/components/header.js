import React from 'react';
import {AppBar, Tabs, Tab} from '@material-ui/core/';
import {NavLink, Link} from 'react-router-dom';

export default class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0
        };
    }

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        return (
            <div>
                <AppBar position="static">
                    <Tabs value={this.state.value} onChange={(event, value) => this.handleChange(event, value)} aria-label="header">
                        <Tab label="Home" component={NavLink} to={"/"} style={{textDecoration: "none"}}/>
                        <Tab label="Create Evaluation" component={NavLink} to={"/create"}/>
                        <Tab label="Item Three" />
                    </Tabs>
                </AppBar>
                {/* <TabPanel value={value} index={0}>
                Item One
                </TabPanel>
                <TabPanel value={value} index={1}>
                Item Two
                </TabPanel>
                <TabPanel value={value} index={2}>
                Item Three
                </TabPanel> */}
            </div>
        );
    }
}