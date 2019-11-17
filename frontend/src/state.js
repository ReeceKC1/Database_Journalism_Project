import { observable, decorate } from '../node_modules/mobx/lib/mobx'

// component for app state
const appState = {
    tacoGlobal: false,
}
// decorating components
decorate(appState, {
    tacoGlobal: observable,
})
// global state variable
export const globalState = {
    appState: appState,
}

// *********** actions on the state ***************