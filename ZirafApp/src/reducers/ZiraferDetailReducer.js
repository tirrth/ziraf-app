import {
	FETCH_ZIRAFER_DETAIL_REQUEST,
	FETCH_ZIRAFER_DETAIL_REQUEST_SUCCESS,
	FETCH_ZIRAFER_DETAIL_REQUEST_ERROR,
	CLEAR_ZIRAFER_DETAIL_REQUEST
} from '../js/actions/actions.js';

export default function zirafer(state = null, action = null) {
	switch (action.type) {
		case FETCH_ZIRAFER_DETAIL_REQUEST:
			return Object.assign({}, state, {
				isFetching: true,
				error: ''
			});

		case FETCH_ZIRAFER_DETAIL_REQUEST_SUCCESS:
			return Object.assign({}, state, {
				isFetching: false,
				data: action.resp.data
			});

		case FETCH_ZIRAFER_DETAIL_REQUEST_ERROR:
			return Object.assign({}, state, {
				isFetching: false,
				error: action.error.message
			});

		case CLEAR_ZIRAFER_DETAIL_REQUEST:
			state = null;
			return state;
		default:
			return state;
	}
}
