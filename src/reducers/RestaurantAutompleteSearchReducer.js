import {
    FETCH_RESTAURANT_AUTOCOMPLETE_REQUEST,
    FETCH_RESTAURANT_AUTOCOMPLETE_REQUEST_SUCCESS,
    FETCH_RESTAURANT_AUTOCOMPLETE_REQUEST_ERROR
} from '../js/actions/actions.js';

export default function restaurantAutocomplete(state = null, action = null) {
    switch (action.type) {
        case FETCH_RESTAURANT_AUTOCOMPLETE_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                error: ''
            });
            
        case FETCH_RESTAURANT_AUTOCOMPLETE_REQUEST_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.resp.data
            });         
    
        case FETCH_RESTAURANT_AUTOCOMPLETE_REQUEST_ERROR:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error.message
            });

        default:
            return state;
    }
}