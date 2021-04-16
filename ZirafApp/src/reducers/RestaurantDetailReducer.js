import {
	FETCH_RESTAURANT_DETAIL_REQUEST,
	FETCH_RESTAURANT_DETAIL_REQUEST_SUCCESS,
	FETCH_RESTAURANT_DETAIL_REQUEST_ERROR,
	CLEAR_RESTAURANT_DETAIL_REQUEST
} from '../js/actions/actions.js';

export default function restaurantDetail(state = null, action = null) {
	switch (action.type) {
		case FETCH_RESTAURANT_DETAIL_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				error: ''
			});

		case FETCH_RESTAURANT_DETAIL_REQUEST_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				data: action.resp.data
			});

		case FETCH_RESTAURANT_DETAIL_REQUEST_ERROR:
			return Object.assign({}, state, {
				isFetching: false,
				error: action.error.message
			});
		case CLEAR_RESTAURANT_DETAIL_REQUEST:
			state = null;
			return state;

		default:
			return state;
	}
}
