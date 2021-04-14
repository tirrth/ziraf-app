import {
	FETCH_ZIRAFER_LIST_REQUEST,
	FETCH_ZIRAFER_LIST_REQUEST_SUCCESS,
	FETCH_ZIRAFER_LIST_REQUEST_ERROR
} from '../js/actions/actions.js';

export default function ziraferList(state = null, action = null) {
	switch (action.type) {
		case FETCH_ZIRAFER_LIST_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				error: ''
			});

		case FETCH_ZIRAFER_LIST_REQUEST_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				data: action.resp.data
			});

		case FETCH_ZIRAFER_LIST_REQUEST_ERROR:
			return Object.assign({}, state, {
				isFetching: false,
				error: action.error.message
			});

		default:
			return state;
	}
}
