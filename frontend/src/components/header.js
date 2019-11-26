import React from 'react';
import {AppBar, Tabs, Tab} from '@material-ui/core/';
import {NavLink} from 'react-router-dom';
import { observer, } from 'mobx-react'
import { globalState, setCurrentTab } from '../state'
import { withStyles } from "@material-ui/core/styles";


 const Header = observer(class Header extends React.Component {
    constructor(props) {
        super(props);

    }

    handleChange = (event, value) => {
        setCurrentTab(value)
    };

    
    render() {
        const style = theme => ({
            root: {
              "&:hover": {
                color: "white",
                textDecoration: "none"
              }
            }
          });

        const CustomTab = withStyles(style)(Tab);

        return (
            <div>
                <AppBar position="static">
                    <Tabs value={globalState.appState.currentTab} onChange={(event, value) => this.handleChange(event, value)} aria-label="header">
                        <CustomTab label="Home" component={NavLink} to={"/"} />
                        <CustomTab label="Create Evaluation" component={NavLink} to={"/create"}/>
                        <CustomTab label="Item Three" />
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