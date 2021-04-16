import {
	FETCH_MOMENT_LIST_REQUEST,
	FETCH_MOMENT_LIST_REQUEST_SUCCESS,
	FETCH_MOMENT_LIST_REQUEST_ERROR
} from '../js/actions/actions.js';

export default function momentList(state = null, action = null) {
	switch (action.type) {
		case FETCH_MOMENT_LIST_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				error: ''
			});

		case FETCH_MOMENT_LIST_REQUEST_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				data: action.resp.data
			});

		case FETCH_MOMENT_LIST_REQUEST_ERROR:
			return Object.assign({}, state, {
				isFetching: false,
				error: action.error.message
			});

		default:
			return state;
	}
}
