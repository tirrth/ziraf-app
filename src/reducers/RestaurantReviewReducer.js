import {
    FETCH_RESTAURANT_REVIEW_REQUEST,
    FETCH_RESTAURANT_REVIEW_REQUEST_SUCCESS,
    FETCH_RESTAURANT_REVIEW_REQUEST_ERROR
} from '../js/actions/actions.js';

export default function restaurantReview(state = null, action = null) {
    switch (action.type) {
        case FETCH_RESTAURANT_REVIEW_REQUEST:
            return Object.assign({}, state, {
                isFetching: true,
                error: ''
            });
            
        case FETCH_RESTAURANT_REVIEW_REQUEST_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                data: action.resp.data,
                restaurantId: action.restaurantId
            });         
    
        case FETCH_RESTAURANT_REVIEW_REQUEST_ERROR:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error.message
            });

        default:
            return state;
    }
}