import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';
import restaurantList from '../restaurantList';

function fetchAppConfigRequest() {
	return {
		type: actions.FETCH_APP_CONFIG_REQUEST
	};
}

function fetchAppConfigRequestSuccess(resp) {
	return {
		type: actions.FETCH_APP_CONFIG_REQUEST_SUCCESS,
		resp
	};
}

function fetchAppConfigRequestError(error, statusCode) {
	return {
		type: actions.FETCH_APP_CONFIG_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchAppConfig() {
	return dispatch => {
		dispatch(fetchAppConfigRequest());
		return fetch(BaseAjaxConfig.host + '/api/v1/config', {
			method: 'GET',
			headers: BaseAjaxConfig.headers
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					let err = new Error('API Error. Failed to fetch');
					dispatch(fetchAppConfigRequestError(err, response.status));
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					dispatch(fetchAppConfigRequestSuccess(json));
				},
				err => {}
			); //console.log(err));
	};
}
