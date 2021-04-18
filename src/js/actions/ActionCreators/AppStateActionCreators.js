import * as actions from '../actions.js';

function setAppStateData(key, data) {
    return {
        type: actions.SET_APP_STATE_DATA,
        key,
        data
    };
}

function clearAppStateData(key) {
    return {
        type: actions.CLEAR_APP_STATE_DATA,
        key
    };
}

export function setAppState(key, data) {
    return (dispatch) => {
        dispatch(setAppStateData(key, data));
    };
}

export function clearAppState(key) {
    return (dispatch) => {
        dispatch(clearAppStateData(key))
    };
}
