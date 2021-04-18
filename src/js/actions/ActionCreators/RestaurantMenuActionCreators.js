import * as actions from '../actions.js';
import BaseAjaxConfig from '../BaseAjaxConfig.js';

function fetchRestaurantMenuRequest() {
	return {
		type: actions.FETCH_RESTAURANT_MENU_REQUEST
	};
}

function fetchRestaurantMenuRequestSuccess(resp, restaurantId) {
	return {
		type: actions.FETCH_RESTAURANT_MENU_REQUEST_SUCCESS,
		resp,
		restaurantId
	};
}

function fetchRestaurantMenuRequestError(error, statusCode) {
	return {
		type: actions.FETCH_RESTAURANT_MENU_REQUEST_ERROR,
		error,
		statusCode
	};
}

export function fetchRestaurantMenu(restaurantId) {
	return dispatch => {
		dispatch(fetchRestaurantMenuRequest());
		return fetch(
			BaseAjaxConfig.host +
				'/api/v1/restaurants/' +
				restaurantId +
				'/menu',
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
						fetchRestaurantMenuRequestError(err, response.status)
					);
					return Promise.reject(err);
				}
			})
			.then(
				json => {
					dispatch(
						fetchRestaurantMenuRequestSuccess(json, restaurantId)
					);
				},
				err => {}
			); //console.log(err));
	};
}
