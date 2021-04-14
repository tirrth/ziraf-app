import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchAutocompleteRequest() {
	return {
		type: actions.FETCH_AUTOCOMPLETE_REQUEST
	};
}

function fetchAutocompleteRequestSuccess(resp) {
	return {
		type: actions.FETCH_AUTOCOMPLETE_REQUEST_SUCCESS,
		resp
	};
}

function fetchAutocompleteRequestError(error, statusCode) {
	return {
		type: actions.FETCH_AUTOCOMPLETE_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchAutocomplete() {
	return dispatch => {
		dispatch(fetchAutocompleteRequest());
		return fetch(BaseAjaxConfig.host + '/api/v1/autocomplete', {
			method: 'GET',
			headers: BaseAjaxConfig.headers
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					let err = new Error('API Error. Failed to fetch');
					dispatch(fetchAutocompleteRequestError(err, response.status));
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					dispatch(fetchAutocompleteRequestSuccess(json));
				},
				err => {}
			); //console.log(err));
	};
}
