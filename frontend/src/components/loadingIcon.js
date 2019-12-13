import React from 'react';
import {globalState} from '../state'
import { observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress'
import { Typography } from '@material-ui/core'

const LoadingIcon = observer(class LoadingIcon extends React.Component {
    render(){
        return(
            <div style={{textAlign: 'center', marginTop: '100px', width: '150px', marginLeft: 'calc(50% - 75px)'}}>
                <CircularProgress/>
                <Typography variant="h5">
                    {globalState.appState.loadingMessage}
                </Typography>
            </div>
        )
    }
})

export default LoadingIcon