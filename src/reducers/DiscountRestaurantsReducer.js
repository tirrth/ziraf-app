import {
	FETCH_DISCOUNT_RESTAURANTS_REQUEST,
	FETCH_DISCOUNT_RESTAURANTS_REQUEST_SUCCESS,
	FETCH_DISCOUNT_RESTAURANTS_REQUEST_ERROR
} from '../js/actions/actions.js';

export default function discountRestaurants(state = null, action = null) {
	switch (action.type) {
		case FETCH_DISCOUNT_RESTAURANTS_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				error: ''
			});

		case FETCH_DISCOUNT_RESTAURANTS_REQUEST_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				data: action.resp.data
			});

		case FETCH_DISCOUNT_RESTAURANTS_REQUEST_ERROR:
			return Object.assign({}, state, {
				isFetching: false,
				error: action.error.message
			});

		default:
			return state;
	}
}
