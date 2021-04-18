import {
	FETCH_MOMENT_RESTAURANTS_REQUEST,
	FETCH_MOMENT_RESTAURANTS_REQUEST_SUCCESS,
	FETCH_MOMENT_RESTAURANTS_REQUEST_ERROR
} from '../js/actions/actions.js';

export default function momentRetaurants(state = null, action = null) {
	switch (action.type) {
		case FETCH_MOMENT_RESTAURANTS_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				error: ''
			});

		case FETCH_MOMENT_RESTAURANTS_REQUEST_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				data: action.resp.data
			});

		case FETCH_MOMENT_RESTAURANTS_REQUEST_ERROR:
			return Object.assign({}, state, {
				isFetching: false,
				error: action.error.message
			});

		default:
			return state;
	}
}
