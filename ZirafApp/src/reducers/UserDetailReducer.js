import {
	FETCH_USER_DETAIL_REQUEST,
	FETCH_USER_DETAIL_REQUEST_SUCCESS,
	FETCH_USER_DETAIL_REQUEST_ERROR,
	CLEAR_USER_DETAIL_REQUEST
} from '../js/actions/actions.js';

export default function userDetail(state = null, action = null) {
	switch (action.type) {
		case FETCH_USER_DETAIL_REQUEST:
			state = null;
			return state;

		case FETCH_USER_DETAIL_REQUEST_SUCCESS:
			if (action.resp.data) {
				state = action.resp.data;
			}
			return state;

		case FETCH_USER_DETAIL_REQUEST_ERROR:
			state = null;
			return state;

		case CLEAR_USER_DETAIL_REQUEST:
			state = null;
			return state;

		default:
			return state;
	}
}
