import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';
import restaurantList from '../restaurantList';

function fetchRestaurantAutoCompleteRequest() {
	return {
		type: actions.FETCH_RESTAURANT_AUTOCOMPLETE_REQUEST
	};
}

function fetchRestaurantAutoCompleteRequestSuccess(resp) {
	return {
		type: actions.FETCH_RESTAURANT_AUTOCOMPLETE_REQUEST_SUCCESS,
		resp
	};
}

function fetchRestaurantAutoCompleteRequestError(error, statusCode) {
	return {
		type: actions.FETCH_RESTAURANT_AUTOCOMPLETE_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchRestaurantAutoComplete(query) {
	return dispatch => {
		dispatch(fetchRestaurantAutoCompleteRequest());
		return fetch(
			BaseAjaxConfig.host + '/api/v1/restaurants/search?search=' + query,
			{
				method: 'GET',
				headers: BaseAjaxConfig.headers
			}
		)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					let err = new Error('API Error. Failed to fetch');
					dispatch(
						fetchRestaurantAutoCompleteRequestError(
							err,
							response.status
						)
					);
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					dispatch(fetchRestaurantAutoCompleteRequestSuccess(json));
					return Promise.resolve(json);
				},
				err => {}
			); //console.log(err));
	};
}
