import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core/';
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import { observer } from 'mobx-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { setCurrentTab } from '../state';

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
                <AppBar ref="appbar"  style={{position: 'fixed'}}>
                    <Toolbar>
                        <div style={{width: '100%'}}>
                            <div style={{float: 'left'}}>
                                <a href="/" style={{float: 'left', color: 'white'}}>
                                <Typography variant="body1" style={{marginTop: '13px'}}>
                                    Baylor Journalism Internships Site
                                </Typography>
                                </a>
                            </div>
                            <div style={{float: 'right'}}>
                                <IconButton component={NavLink} to={"/"}>
                                    <HomeIcon style={{color: 'white'}}/>
                                </IconButton>
                                <IconButton component={NavLink} to={"/create"} title="Create new evaluation">
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