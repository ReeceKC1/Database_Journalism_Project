import React from 'react';
import {AppBar, Tabs, Tab} from '@material-ui/core/';
import {NavLink, Link} from 'react-router-dom';
import { observer, } from 'mobx-react'
import { globalState, setCurrentTab } from '../state'


 const Header = observer(class Header extends React.Component {
    constructor(props) {
        super(props);

    }

    handleChange = (event, value) => {
        setCurrentTab(value)
    };

    
    render() {

        return (
            <div>
                <AppBar position="static">
                    <Tabs value={globalState.appState.currentTab} onChange={(event, value) => this.handleChange(event, value)} aria-label="header">
                        <Tab label="Home" component={NavLink} to={"/"} />
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
})

export default Header