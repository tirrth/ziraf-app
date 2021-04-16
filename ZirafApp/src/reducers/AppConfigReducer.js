import {
    FETCH_APP_CONFIG_REQUEST,
    FETCH_APP_CONFIG_REQUEST_SUCCESS,
    FETCH_APP_CONFIG_REQUEST_ERROR
} from '../js/actions/actions.js';

export default function appConfig(state = null, action = null) {
    switch (action.type) {
        case FETCH_APP_CONFIG_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                error: ''
            });
            
        case FETCH_APP_CONFIG_REQUEST_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.resp.data
            });         
    
        case FETCH_APP_CONFIG_REQUEST_ERROR:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error.message
            });

        default:
            return state;
    }
}
