import {
    FETCH_RESTAURANT_LIST_REQUEST,
    FETCH_RESTAURANT_LIST_REQUEST_SUCCESS,
    FETCH_RESTAURANT_LIST_REQUEST_ERROR
} from '../js/actions/actions.js';

export default function restaurantList(state = null, action = null) {
    switch (action.type) {
        case FETCH_RESTAURANT_LIST_REQUEST:
            if (state && state.data && state.page >= 1) {
                return Object.assign({}, state, {
                    error: ''
                });
            } else {
                return Object.assign({}, state, {
                    isFetching: true,
                    error: ''
                });
            }
            
        case FETCH_RESTAURANT_LIST_REQUEST_SUCCESS:
            let data = (state.data || []);
            if (action.resp.data && action.resp.page > 1) {
                data = data.concat(action.resp.data)
            } else {
                data = action.resp.data;
            }
            return Object.assign({}, state, {
                isFetching: false,
                data: data,
                page: action.resp.page,
                count: action.resp.count
            });

        case FETCH_RESTAURANT_LIST_REQUEST_ERROR:
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error.message
            });

        default:
            return state;
    }
}