import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchZirafersRequest() {
	return {
		type: actions.FETCH_ZIRAFER_LIST_REQUEST
	};
}

function fetchZirafersRequestSuccess(resp) {
	return {
		type: actions.FETCH_ZIRAFER_LIST_REQUEST_SUCCESS,
		resp
	};
}

function fetchZirafersRequestError(error, statusCode) {
	return {
		type: actions.FETCH_ZIRAFER_LIST_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchZirafers() {
	return dispatch => {
		//console.log('DISPATCH FETCH ZIRAFER');
		dispatch(fetchZirafersRequest());
		return fetch(BaseAjaxConfig.host + '/api/v1/zirafers', {
			method: 'GET',
			headers: BaseAjaxConfig.headers
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					let err = new Error('API Error. Failed to fetch');
					dispatch(fetchZirafersRequestError(err, response.status));
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					dispatch(fetchZirafersRequestSuccess(json));
				},
				err => {} //console.log(err)
			);
	};
}
