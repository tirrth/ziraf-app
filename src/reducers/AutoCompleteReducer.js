import {
    FETCH_AUTOCOMPLETE_REQUEST,
    FETCH_AUTOCOMPLETE_REQUEST_SUCCESS,
    FETCH_AUTOCOMPLETE_REQUEST_ERROR
} from '../js/actions/actions.js';

export default function autocomplete(state = null, action = null) {
    switch (action.type) {
        case FETCH_AUTOCOMPLETE_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                error: ''
            });
            
        case FETCH_AUTOCOMPLETE_REQUEST_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.resp.data
            });         
    
        case FETCH_AUTOCOMPLETE_REQUEST_ERROR:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error.message
            });

        default:
            return state;
    }
}
