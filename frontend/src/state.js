import { observable, decorate } from '../node_modules/mobx/lib/mobx'

// component for app state
const appState = {
    currentTab: 0,
}
// decorating components
decorate(appState, {
    currentTab: observable,
})
// global state variable
export const globalState = {
    appState: appState,
}

// *********** actions on the state ***************
export function setCurrentTab(value){
    globalState.currentTab = value
}