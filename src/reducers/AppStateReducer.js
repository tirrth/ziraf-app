import {
    SET_APP_STATE_DATA,
    CLEAR_APP_STATE_DATA
} from '../js/actions/actions.js';

export default function appState(state={}, action=null) {
    switch (action.type) {
        case SET_APP_STATE_DATA:
            state[action.key] = action.data;
            return Object.assign({}, state);
            
        case CLEAR_APP_STATE_DATA:
            state[action.key] = null;
            return Object.assign({}, state);

        default:
            return state;
    }
}