import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchMomentsRequest() {
	return {
		type: actions.FETCH_MOMENT_LIST_REQUEST
	};
}

function fetchMomentsRequestSuccess(resp) {
	return {
		type: actions.FETCH_MOMENT_LIST_REQUEST_SUCCESS,
		resp
	};
}

function fetchMomentsRequestError(error, statusCode) {
	return {
		type: actions.FETCH_MOMENT_LIST_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchMoments() {
	return dispatch => {
		//console.log('DISPATCH FETCH MOMENT');
		dispatch(fetchMomentsRequest());
		//return fetch(BaseAjaxConfig.host + '/api/v1/moments', {
		return fetch(BaseAjaxConfig.host + '/api/v1/moments/getActiveMoments', {
			method: 'GET',
			headers: BaseAjaxConfig.headers
		})
			.then(response => {
				//console.log(response);
				if (response.ok) {
					return response.json();
				} else {
					let err = new Error('API Error. Failed to fetch');
					dispatch(fetchMomentsRequestError(err, response.status));
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					//console.log(json);
					dispatch(fetchMomentsRequestSuccess(json));
				},
				err => {} //console.log(err)
			);
	};
}
