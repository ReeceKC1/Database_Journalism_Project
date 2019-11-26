import React from 'react';
import {AppBar, Tabs, Tab, Toolbar, IconButton, Typography } from '@material-ui/core/';
import {NavLink} from 'react-router-dom';
import { observer, } from 'mobx-react'
import { globalState, setCurrentTab } from '../state'
import { withStyles } from "@material-ui/core/styles";
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';
import { withRouter } from 'react-router-dom';

 const Header = observer(class Header extends React.Component {
    constructor(props) {
        super(props);

    }

    handleChange = (event, value) => {
        setCurrentTab(value)
    };

    handleHomeClick = () => {
        // this.props.history.push('/')
    }

    handleAddClick = () => {
        // this.props.history.push('/create')
    }

    
    render() {
        const style = theme => ({
            root: {
              "&:hover": {
                color: "white",
                textDecoration: "none"
              }
            }
          });

        // const CustomTab = withStyles(style)(Tab);

        return (
            <div>
                <AppBar position="sticky">
                    <Toolbar>
                        <div style={{width: '100%'}}>
                            <div style={{float: 'left'}}>
                                <Typography variant="body1" style={{marginTop: '13px'}}>
                                    Peepee Poopoo Site
                                </Typography>
                            </div>
                            <div style={{float: 'right'}}>
                                <IconButton component={NavLink} to={"/"}>
                                    <HomeIcon style={{color: 'white'}}/>
                                </IconButton>
                                <IconButton component={NavLink} to={"/create"}>
                                    <AddIcon style={{color: 'white'}}/>
                                </IconButton>
                            </div>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
})

export default Header